# MyLink — Product Requirements Document (PRD)

> **버전**: v0.2  
> **작성일**: 2026-11-01  
> **작성자**: 김예현  
> **상태**: 검토 전 초안(Draft)  
> **변경 이력**:  
> - v0.1 → v0.2: 전역 상태 관리 전략 추가, 개발 단계(Phase) 재정의, 기술 스택 보완

---

## 1. 배경 및 목적 (Background & Objective)

링크트리(Linktree)는 SNS 바이오 칸에 들어가는 링크 집합 페이지로, 크리에이터·학생·개인 모두가 손쉽게 "내 모든 채널"을 한 곳에 모아 공유할 수 있게 해 준다.

**MyLink**는 이 링크 인 바이오 카테고리의 국내 클론 서비스로, 다음 목표를 가진다.

- **누구나** 간편 가입 후 나만의 퍼블릭 프로필 페이지(`mylink.app/@handle`)를 만든다.
- 링크 관리를 **모바일에서도 쉽고 직관적**으로 할 수 있게 한다.
- **토스 디자인 시스템(TDS)** 기반의 깔끔하고 신뢰감 있는 UI를 제공한다.
- 추후 분석·수익화·API 기능을 올릴 수 있는 **확장 가능한 기반**을 마련한다.

---

## 2. 타깃 사용자 (Target Users)

| 페르소나 | 설명 | 주요 니즈 |
|---|---|---|
| **대학생 / 새내기** | 깃허브·블로그·SNS 등 채널이 늘어나는 시기 | 빠른 가입, 간편한 링크 추가 |
| **사이드 프로젝터** | 포트폴리오·데모·노션 등을 한 링크로 공유 | 정렬·카테고리·미리보기 |
| **소규모 크리에이터** | 인스타·유튜브·쇼핑 링크 묶음 공유 | 방문 통계, 깔끔한 디자인 |
| **관리자(Admin)** | 서비스 운영, 유저 모니터링 | 대시보드, 플래그 처리 |

---

## 3. 개발 단계 (Development Phases)

> 백엔드 연동 전에 UI·UX를 먼저 검증하고, 이후 단계에서 실제 서버와 연결한다.

### Phase 0 — UI 프로토타입 (현재 단계)

**목표**: 백엔드 없이 `localStorage`만으로 핵심 흐름을 검증한다.

| # | 기능 | 비고 |
|---|---|---|
| P0-01 | 퍼블릭 프로필 페이지 (`/`) | 아바타·이름·소개·링크 목록 표시 |
| P0-02 | 프로필 & 링크 편집 (`/edit`) | localStorage 읽기/쓰기 |
| P0-03 | 링크 CRUD + DnD 순서 변경 | 로컬 상태만 사용 |
| P0-04 | 링크 ON/OFF 토글 | 로컬 상태만 사용 |
| P0-05 | 프로필 URL 복사 & QR 코드 | 클라이언트 전용 |

**데이터 저장소**: `localStorage` (`mylink_data` 키)  
**인증**: 없음 (단일 사용자 전제)  
**통계/대시보드**: Phase 0 범위 외

---

### Phase 1 — MVP (멀티유저 SaaS)

**목표**: Supabase 연동, 실제 멀티유저 서비스 출시.

| # | 기능 영역 | 설명 |
|---|---|---|
| F-01 | 인증 | 소셜 로그인(Google·GitHub·카카오), 이메일+패스워드 |
| F-02 | 핸들 설정 | 가입 직후 `@handle` 선택 (영문·숫자·언더스코어, 3-30자) |
| F-03 | 프로필 편집 | 이름, 한 줄 소개, 아바타 이미지 업로드 |
| F-04 | 링크 CRUD | 제목·URL·썸네일 아이콘 등록/수정/삭제 |
| F-05 | 링크 순서 변경 | 드래그 앤 드롭(모바일 터치 포함) |
| F-06 | 링크 ON/OFF | 개별 링크 활성화/비활성화 토글 |
| F-07 | 퍼블릭 페이지 | `/@handle` 공개 프로필 페이지 (비로그인 접근 가능) |
| F-08 | 공유 기능 | 퍼블릭 URL 복사, 네이티브 공유 시트, QR 코드 다운로드 |
| F-09 | 기본 통계 | 총 방문자 수, 링크별 클릭 수 (지난 30일) |
| F-10 | 반응형 레이아웃 | 모바일 퍼스트, 태블릿·데스크탑 대응 |

---

### Out of Scope (Phase 2 이후 고려)

- 유료 플랜 / 결제 연동
- 유튜브·음원 임베드 등 리치 미디어 블록
- 팀/조직 계정
- 커스텀 도메인 연결
- 고급 분석 (UTM, 국가별 방문, 디바이스 분석)
- 방명록 / 응원 메시지 기능

---

## 4. 사용자 스토리 (User Stories)

### 인증 & 온보딩 (Phase 1)

```
US-01  비가입자로서, 구글 계정 하나로 30초 안에 가입을 완료하고 싶다.
       → 소셜 로그인 후 핸들 설정 화면 진입까지 화면 수 3개 이하.

US-02  가입자로서, 내 @handle 이 이미 사용 중인지 실시간으로 확인하고 싶다.
       → 타이핑 중 중복 여부 즉시 표시(debounce 500ms).
```

### 링크 관리

```
US-03  사용자로서, 링크를 새로 추가할 때 URL만 붙여넣으면
       제목이 자동으로 채워지면 좋겠다. (OGP meta fetch)

US-04  사용자로서, 화면에서 링크를 위아래로 드래그해
       노출 순서를 바꿀 수 있어야 한다.

US-05  사용자로서, 링크를 ON/OFF할 수 있어서
       삭제하지 않고 임시로 숨길 수 있어야 한다.
```

### 퍼블릭 페이지 & 공유

```
US-06  방문자로서, mylink.app/@handle 에 접근하면
       프로필 사진·이름·소개·링크 목록을 볼 수 있어야 한다.

US-07  사용자로서, QR 코드를 다운로드받아 명함·포스터에 붙이고 싶다.
```

### 통계 (Phase 1)

```
US-08  로그인 사용자로서, 대시보드에서 지난 30일간
       페이지 방문자 수와 링크별 클릭 수를 확인하고 싶다.
```

---

## 5. 기능 상세 (Functional Requirements)

### F-01 인증 (Phase 1)

| 항목 | 상세 |
|---|---|
| 제공 방식 | Supabase Auth — OAuth (Google, GitHub, Kakao), 이메일+패스워드 |
| 세션 | Supabase JWT, Refresh Token 자동 갱신 |
| 비밀번호 정책 | 8자 이상, 영문+숫자 혼합 |
| 이메일 인증 | 신규 이메일 가입 시 인증 메일 발송 필수 |
| 탈퇴 | 계정 삭제 시 연관 링크·프로필·통계 데이터 즉시 파기 |

### F-02 핸들 설정 (Phase 1)

- 형식: `[a-z0-9_]`, 3~30자
- 예약어(`admin`, `api`, `login` 등) 사용 불가
- 변경: 30일에 1회 허용 (무분별한 스쿼팅 방지)
- 삭제된 핸들: 14일 쿨다운 후 재사용 가능

### F-03 프로필

| 필드 | 타입 | 제약 |
|---|---|---|
| handle | string | 영문·숫자·언더스코어, 3~30자 |
| display_name | string | 최대 50자 |
| bio | string | 최대 160자 |
| avatar | image | WebP 권장, 최대 2MB, 1:1 비율 권장 |

### F-04 링크

| 필드 | 타입 | 제약 |
|---|---|---|
| title | string | 최대 60자 |
| url | string (URL) | `https://` 강제, 유효 URL 검증 |
| icon | emoji / 이미지 | 이모지 선택 또는 직접 업로드 |
| is_active | boolean | 기본 true |
| sort_order | integer | DnD 시 재정렬 |

- 1계정 최대 링크 수: **30개** (MVP)
- URL 붙여넣기 시 Open Graph Title 자동 채우기 시도

### F-07 퍼블릭 페이지

- 경로: `mylink.app/@{handle}` (Phase 1) / `/` (Phase 0 로컬)
- 비로그인 접근 허용, SEO 대응 (`og:title`, `og:image` 메타 태그)
- 비활성(`is_active = false`) 링크는 렌더링에서 제외
- 링크 클릭 시 클릭 이벤트 기록 후 해당 URL로 새 탭 이동

### F-09 기본 통계 (Phase 1)

| 지표 | 설명 |
|---|---|
| 페이지 뷰 | 퍼블릭 페이지 접근 시 1회 기록 (동일 IP 1시간 내 중복 제거) |
| 링크 클릭 | 링크 클릭 시 비동기 기록 (사용자 UX 지연 없음) |
| 조회 기간 | 최근 30일 집계, MVP에서는 날짜별 차트 미제공 |

---

## 6. 비기능 요구사항 (Non-Functional Requirements)

| 카테고리 | 요구사항 |
|---|---|
| **성능** | 퍼블릭 페이지 LCP ≤ 1.5s (3G 기준), TTI ≤ 3s |
| **가용성** | 월 99.5% 업타임 목표 |
| **보안** | XSS 방지, URL 화이트리스트/검증, Supabase RLS 정책 적용 |
| **접근성** | WCAG 2.1 AA 기준 준수 (키보드 탐색, 색상 대비) |
| **반응형** | 360px ~ 1920px 모든 화면 대응 |
| **SEO** | 퍼블릭 페이지 SSR/ISR 렌더링, robots.txt, sitemap.xml |

---

## 7. 기술 스택 (Tech Stack)

| 레이어 | 기술 |
|---|---|
| **프레임워크** | Next.js 15+ (App Router) + TypeScript |
| **스타일링** | Tailwind CSS v4 + TDS 디자인 토큰 |
| **인증 / DB** | Supabase (Auth + PostgreSQL + Storage) — Phase 1 |
| **임시 데이터** | `localStorage` — Phase 0 프로토타입 전용 |
| **DnD** | `@dnd-kit/core` (모바일 터치 지원) |
| **폼 검증** | `zod` + React Hook Form |
| **배포** | Vercel (Edge Network, ISR) |

### 전역 상태 관리 전략

> MyLink 규모에서는 **Redux·Zustand 같은 별도 전역 스토어를 사용하지 않는다.**  
> 상태 종류별로 아래 방식을 따른다.

| 상태 종류 | 관리 방법 | 비고 |
|---|---|---|
| 인증 세션 | Supabase SSR + `useUser()` 훅 | Phase 1 |
| 서버 데이터 (링크·프로필) | Server Components fetch + Server Actions + `revalidatePath` | Phase 1 |
| localStorage 데이터 | 커스텀 훅 (`useLocalStorage`) + `useState` | Phase 0 |
| DnD 낙관적 UI | React 19 `useOptimistic` | 즉각 반응 후 서버 동기화 |
| 토스트·모달 등 UI 상태 | React Context + `useState` | 앱 전역 공유 필요한 것만 |

**Zustand 도입 검토 시점**: 클라이언트 전용 복잡한 다단계 폼, 실시간 협업, 오프라인 PWA 큐잉이 필요해지는 시점.

---

## 8. 데이터 모델 (ERD 요약)

### Phase 0 — localStorage 스키마

```ts
interface MyLinkData {
  profile: {
    handle: string;
    display_name: string;
    bio: string;
    avatar_url: string; // base64 또는 빈 문자열
  };
  links: Array<{
    id: string;        // crypto.randomUUID()
    title: string;
    url: string;
    icon: string;      // 이모지 or 이미지 URL
    is_active: boolean;
    sort_order: number;
  }>;
}
// localStorage key: "mylink_data"
```

### Phase 1 — PostgreSQL (Supabase)

```
users (Supabase Auth)
  └── profiles
        ├── id (FK → users.id)
        ├── handle        UNIQUE
        ├── display_name
        ├── bio
        ├── avatar_url
        └── handle_changed_at

profiles
  └── links
        ├── id
        ├── profile_id    FK
        ├── title
        ├── url
        ├── icon
        ├── is_active
        └── sort_order

link_events
  ├── id
  ├── link_id / profile_id
  ├── event_type        ("view" | "click")
  ├── ip_hash           (SHA-256, PII 최소화)
  └── created_at
```

---

## 9. 화면 목록 (Screen Inventory)

| 번호 | 화면 이름 | 경로 | Phase | 비고 |
|---|---|---|---|---|
| S-01 | 퍼블릭 프로필 페이지 | `/` (P0) / `/@{handle}` (P1) | **P0·P1** | 핵심 공개 화면 |
| S-02 | 프로필 & 링크 편집 | `/edit` (P0) / `/dashboard` (P1) | **P0·P1** | 로그인 보호(P1) |
| S-03 | 랜딩 페이지 | `/` | P1 | 소개 + 시작하기 CTA |
| S-04 | 로그인 | `/login` | P1 | 소셜 + 이메일 |
| S-05 | 가입 / 핸들 설정 | `/onboarding` | P1 | 가입 직후 1회 |
| S-06 | 프로필 설정 | `/settings/profile` | P1 | 이름·소개·아바타 |
| S-07 | 통계 | `/analytics` | P1 | 방문자 / 클릭 |
| S-08 | 404 / 존재하지 않는 핸들 | — | P1 | |

---

## 10. 성공 지표 (Success Metrics)

| 지표 | MVP 목표 (출시 후 3개월) |
|---|---|
| 가입 완료율 | 랜딩 방문 대비 **30%** 이상 |
| 핸들 설정 완료율 | 가입자 대비 **85%** 이상 |
| 1인당 평균 링크 수 | **3개** 이상 |
| DAU / MAU 비율 | **20%** 이상 |
| 퍼블릭 페이지 LCP | **1.5s** 이하 (Vercel Analytics 기준) |

---

## 11. 마일스톤 (Milestones)

| 단계 | 기간 | 주요 deliverable |
|---|---|---|
| **Phase 0** UI 프로토타입 | 1~2주 | localStorage 기반 프로필+편집 페이지 완성 |
| **M1** 설계 | 1주 | 와이어프레임, DB 스키마 확정, 환경 구성 |
| **M2** 인증·핸들 | 1주 | 로그인/가입 플로우, 핸들 설정 완료 |
| **M3** 링크 CRUD | 1주 | 대시보드 링크 관리, DnD 정렬 |
| **M4** 퍼블릭 페이지 | 1주 | SSR 퍼블릭 프로필, 공유·QR 기능 |
| **M5** 통계·마무리 | 1주 | 클릭 추적, 분석 뷰, 버그 수정, 배포 |
| **M6** 출시 (Alpha) | — | Vercel 배포, 베타 유저 초대 |

---

## 12. 열린 질문 (Open Questions)

> 아래 항목들은 의사결정이 필요한 사안이에요. 함께 논의해 주세요.

- [ ] **OQ-01** 카카오 소셜 로그인은 MVP에 포함할까요, v1.1로 미룰까요? (사업자 등록 필요)
- [ ] **OQ-02** 링크 클릭 시 리다이렉트 방식 — 중간 서버 라우팅(통계 보장) vs. 클라이언트 직접 이동(UX 빠름)?
- [ ] **OQ-03** 핸들 변경 30일 제한 정책, 적절한 기간인가요?
- [ ] **OQ-04** 무료 플랜 링크 수 상한(현재 30개)을 더 줄이거나 늘릴 필요가 있을까요?
- [ ] **OQ-05** MVP에서 모바일 앱(PWA) 설치 배너를 노출할까요?
