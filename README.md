# Serviceweb

Next.js App Router 기반 메이플스토리 캐릭터 조회 서비스입니다.

## 로컬 실행

Node.js 24.x와 npm을 사용합니다. 저장소의 `.nvmrc`와 `package.json#engines`가 같은 버전을 지정합니다.

```bash
nvm use
npm ci
cp .env.example .env.local
```

`.env.local`의 `NEXON_OPEN_API_KEY`에 발급받은 넥슨 Open API 키를 입력한 뒤 실행합니다. 기존 `.env.local`이 있으면 복사 대신 기존 파일을 편집합니다.

```bash
npm run dev
```

API 키는 서버에서만 사용합니다. `NEXT_PUBLIC_` 접두사를 붙이거나 Git에 커밋하지 않습니다.

## 배포 전 검증

```bash
npm run check
npm run start
```

`check`는 라우트 타입 생성, TypeScript 검사, 회귀 테스트, ESLint, 프로덕션 빌드를 순서대로 실행합니다. `build` 자체에도 경고를 허용하지 않는 ESLint 검사가 포함됩니다. Next.js 빌드의 타입 검사는 비활성화하지 않습니다.

테스트는 외부 API 응답을 모의하므로 실제 API 키 없이 실행할 수 있습니다. 키 누락, HTTP 오류, 타임아웃, 잘못된 응답 데이터, 한국 시간 기준 날짜, 특수문자가 포함된 경로를 검증합니다. GitHub Actions에서도 Linux와 Node.js 24 환경에서 `npm ci`와 `npm run check`를 실행합니다.

프로덕션 서버에서는 홈페이지, 정상 캐릭터 검색, 존재하지 않는 캐릭터, 잘못된 경로를 확인합니다. 실제 API 연결은 유효한 키가 있는 환경에서 별도로 확인해야 합니다.

## Vercel 설정

| 설정 | 값 |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | 이 저장소 루트 |
| Node.js Version | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Next.js 기본값 유지 |
| 환경변수 | `NEXON_OPEN_API_KEY` |

환경변수는 사용할 **Production과 Preview 환경 각각**에 등록합니다. 로컬의 `.env.local`은 Git 배포에 포함되지 않습니다. 환경변수를 수정했다면 새 배포를 생성해야 적용됩니다.

Vercel에서 `NEXON_OPEN_API_KEY`가 비어 있으면 빌드가 명확한 오류로 중단됩니다. 정적 파일만 내보내는 `output: "export"`는 사용하지 않습니다. 캐릭터 페이지와 Server Action에 서버 실행 환경이 필요합니다.

- [Vercel Node.js 버전 설정](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel 환경변수 설정](https://vercel.com/docs/environment-variables)

## 서버와 클라이언트 역할

- `app/actions/`: 클라이언트에서 호출할 수 있는 Server Action.
- `lib/nexon/`: API 키, 10초 요청 제한, 응답 검증을 담당하는 서버 데이터 접근 계층.
- `lib/client/searchCharacter.ts`: Server Action 통신 실패를 사용자 메시지로 변환하는 클라이언트 래퍼.
- `app/Module/`: 화면과 사용자 입력 처리.

폰트는 `geist` 패키지의 로컬 파일을 사용하므로 빌드 중 Google Fonts에 연결하지 않습니다. 종합 랭킹은 한국 시간 기준 전날 데이터를 조회하고 1시간 캐시합니다.
