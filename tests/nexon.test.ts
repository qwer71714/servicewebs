import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { getCharacterId } from "../app/actions/mapleCharacter";
import { getOverallFirstRank } from "../app/actions/mapleOverallFirstRank";
import { getCharacterBasicByOcid } from "../lib/nexon/getCharacterBasicByOcid";
import { getCharacterOcidByName } from "../lib/nexon/getCharacterOcidByName";

const originalApiKey = process.env.NEXON_OPEN_API_KEY;
const character = {
  date: null,
  character_name: "테스트",
  world_name: "루나",
  character_gender: "여",
  character_class: "아델",
  character_class_level: "6",
  character_level: 285,
  character_exp: 123456789,
  character_exp_rate: "12.34",
  character_guild_name: null,
  character_image: "https://example.com/character.png",
};
const ranking = {
  date: "2026-10-01",
  ranking: 1,
  character_name: "테스트",
  world_name: "루나",
  class_name: "전사",
  sub_class_name: "히어로",
  character_level: 300,
  character_exp: 123456789,
  character_popularity: 100,
  character_guildname: null,
};

beforeEach(() => {
  process.env.NEXON_OPEN_API_KEY = "test-key";
  mock.method(console, "error", () => {});
  // An unexpected network call must fail the test rather than hit the real API.
  mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected network request");
  });
});

afterEach(() => {
  mock.restoreAll();
  if (originalApiKey === undefined) delete process.env.NEXON_OPEN_API_KEY;
  else process.env.NEXON_OPEN_API_KEY = originalApiKey;
});

test("missing or blank API keys return a safe error without fetching", async () => {
  const fetchMock = mock.method(globalThis, "fetch");
  for (const key of [undefined, "   "]) {
    if (key === undefined) delete process.env.NEXON_OPEN_API_KEY;
    else process.env.NEXON_OPEN_API_KEY = key;
    const result = await getCharacterOcidByName("테스트");
    assert.equal(result.success, false);
    assert.equal(JSON.stringify(result).includes("NEXON_OPEN_API_KEY"), false);
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("empty and file-valued character searches never call the API", async () => {
  const fetchMock = mock.method(globalThis, "fetch");
  for (const input of [null, "   ", new Blob(["test"])]) {
    const form = new FormData();
    if (input !== null) form.set("characterName", input);
    const result = await getCharacterId({ success: false }, form);
    assert.equal(result.success, false);
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("character search encodes input, trims it and keeps the API key server-side", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async (url: RequestInfo | URL, options?: RequestInit) => {
    assert.equal(new URL(String(url)).searchParams.get("character_name"), "테스트%&");
    assert.equal(new Headers(options?.headers).get("x-nxopen-api-key"), "test-key");
    assert.equal(options?.cache, "no-store");
    assert.ok(options?.signal instanceof AbortSignal);
    return Response.json({ ocid: "test-ocid" });
  });
  const form = new FormData();
  form.set("characterName", "  테스트%&  ");
  assert.deepEqual(await getCharacterId({ success: false }, form), {
    success: true, ocid: "test-ocid", characterName: "테스트%&",
  });
  assert.equal(fetchMock.mock.callCount(), 1);
});

for (const status of [400, 401, 403, 404, 429, 500, 503]) {
  test(`HTTP ${status} returns a failure instead of an exception`, async () => {
    mock.method(globalThis, "fetch", async () => new Response("upstream error", { status }));
    const result = await getCharacterOcidByName("테스트");
    assert.equal(result.success, false);
    if (!result.success) {
      assert.match(result.error, status === 429 ? /요청이 많습니다/ : new RegExp(String(status)));
    }
  });
}

test("invalid JSON and invalid OCIDs are rejected", async () => {
  for (const body of ["not-json", "null", "{}", '{"ocid":123}', '{"ocid":" "}']) {
    mock.method(globalThis, "fetch", async () => new Response(body));
    assert.equal((await getCharacterOcidByName("테스트")).success, false);
  }
});

test("network failures are represented as errors", async () => {
  mock.method(globalThis, "fetch", async () => { throw new TypeError("fetch failed"); });
  assert.equal((await getCharacterOcidByName("테스트")).success, false);
});

test("a stalled upstream request is aborted and returns a timeout error", async () => {
  const realTimeout = AbortSignal.timeout.bind(AbortSignal);
  mock.method(AbortSignal, "timeout", (milliseconds: number) => {
    assert.equal(milliseconds, 10_000);
    return realTimeout(5);
  });
  mock.method(globalThis, "fetch", (_url: RequestInfo | URL, options?: RequestInit) => new Promise<Response>((_resolve, reject) => {
    const keepAlive = setTimeout(() => reject(new Error("Request did not abort")), 1000);
    options?.signal?.addEventListener("abort", () => {
      clearTimeout(keepAlive);
      reject(options.signal?.reason);
    }, { once: true });
  }));
  const result = await getCharacterOcidByName("테스트");
  assert.equal(result.success, false);
  if (!result.success) assert.match(result.error, /시간이 초과/);
});

test("current character data accepts a null date and no guild", async () => {
  mock.method(globalThis, "fetch", async () => Response.json(character));
  assert.deepEqual(await getCharacterBasicByOcid("test-ocid"), { success: true, data: character });
});

test("malformed character data cannot reach page rendering", async () => {
  for (const body of [null, {}, { ...character, character_exp: null }, { ...character, world_name: {} }]) {
    mock.method(globalThis, "fetch", async () => Response.json(body));
    assert.equal((await getCharacterBasicByOcid("test-ocid")).success, false);
  }
});

test("ranking uses the previous Korean date at the UTC date boundary and caches for one hour", async () => {
  mock.method(Date, "now", () => Date.parse("2026-10-01T15:01:00Z"));
  mock.method(globalThis, "fetch", async (url: RequestInfo | URL, options?: RequestInit) => {
    assert.equal(new URL(String(url)).searchParams.get("date"), "2026-10-01");
    assert.deepEqual((options as { next?: { revalidate: number } }).next, { revalidate: 3600 });
    assert.equal(options?.cache, undefined);
    return Response.json({ ranking: [{ ...ranking, ranking: 2 }, ranking] });
  });
  assert.deepEqual(await getOverallFirstRank(), { success: true, ranking });
});

test("empty or malformed ranking responses return errors", async () => {
  for (const body of [null, {}, { ranking: null }, { ranking: [] }, { ranking: [null] }, { ranking: [{ ...ranking, character_exp: null }] }]) {
    mock.method(globalThis, "fetch", async () => Response.json(body));
    assert.equal((await getOverallFirstRank()).success, false);
  }
});
