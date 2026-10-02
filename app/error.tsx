"use client";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <section role="alert" className="mx-auto max-w-2xl px-5 py-14 text-center">
      <h1 className="text-2xl font-bold">페이지를 불러오지 못했습니다.</h1>
      <p className="mt-4 text-gray-500">잠시 후 다시 시도해주세요.</p>
      <button
        type="button"
        onClick={retry}
        className="mt-6 rounded-xl bg-blue-500 px-5 py-3 text-white"
      >
        다시 시도
      </button>
    </section>
  );
}
