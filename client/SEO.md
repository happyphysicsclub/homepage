# SEO 가이드

## 구조 개요

```
app/
├── layout.tsx        # 전역 메타데이터 (모든 페이지에 적용)
├── manifest.ts       # PWA 매니페스트 (자동으로 /manifest.webmanifest 생성)
├── page.tsx          # 홈페이지
└── [slug]/
    └── page.tsx      # 각 페이지별 메타데이터 추가

src/config/index.ts   # APP_INFO — 사이트 공통 정보 단일 관리
```

---

## 공통 정보 수정

사이트 이름, 설명, URL, 소셜 링크 등은 모두 `src/config/index.ts`의 `APP_INFO`에서 관리합니다.
layout.tsx와 manifest.ts가 이 값을 참조하므로 여기만 수정하면 전체에 반영됩니다.

```ts
// src/config/index.ts
export const APP_INFO = {
  name: 'happyphysicsclub',
  title: 'happyphysicsclub',
  titleTemplate: '%s | happyphysicsclub',   // 하위 페이지 제목 형식
  description: '...',                        // 검색 결과 스니펫 (130–160자 권장)
  keywords: ['...'],
  authors: [{ name: '...', url: '...' }],
  url: 'https://happyphysics.club',
  social_links: [{ name: 'Instagram', url: '...' }],
  google_site_verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
}
```

---

## 새 페이지 만들기

### 1. 정적 페이지

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'
import { APP_INFO } from '@/config'

export const metadata: Metadata = {
  title: 'About',                              // → "About | happyphysicsclub"
  description: '페이지 고유 설명 (130–160자)',
  alternates: {
    canonical: `${APP_INFO.url}/about`,        // 페이지 canonical URL 필수
  },
  openGraph: {
    title: 'About | happyphysicsclub',
    description: '페이지 고유 설명',
    images: { url: '/og/about.png', width: 1200, height: 630, alt: 'About' },
  },
}

export default function AboutPage() {
  return (
    <>
      <main>
        <h1>About</h1>
      </main>
      <footer>...</footer>
    </>
  )
}
```

### 2. 동적 페이지 (slug 기반)

```tsx
// app/work/[slug]/page.tsx
import type { Metadata } from 'next'
import { APP_INFO } from '@/config'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const work = await fetchWork(slug)

  return {
    title: work.title,
    description: work.description,
    alternates: { canonical: `${APP_INFO.url}/work/${slug}` },
    openGraph: {
      title: work.title,
      images: { url: work.ogImage, width: 1200, height: 630, alt: work.title },
    },
  }
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params
  const work = await fetchWork(slug)

  return (
    <main>
      <h1>{work.title}</h1>
    </main>
  )
}
```

---

## 페이지 컴포넌트 규칙

### 서버 컴포넌트 우선

페이지는 기본적으로 서버 컴포넌트로 유지합니다.
클라이언트 기능이 필요한 부분만 별도 컴포넌트로 분리하고 `'use client'`를 붙입니다.

```tsx
// ✅ 올바른 방식
// app/page.tsx — 서버 컴포넌트 (no 'use client')
import { InteractiveWidget } from '@/components/InteractiveWidget'  // 'use client' 분리

export default function Page() {
  return (
    <main>
      <h1>서버에서 렌더링되는 콘텐츠</h1>
      <InteractiveWidget />
    </main>
  )
}

// ❌ 잘못된 방식
'use client'  // 페이지 전체에 붙이면 h1도 클라이언트 번들에 포함됨
export default function Page() { ... }
```

### 시맨틱 HTML 구조

```tsx
// ✅ 올바른 구조
<>
  <main>
    <h1>페이지 제목</h1>          {/* 페이지당 h1 하나 */}
    <h2>섹션 제목</h2>
    <h3>하위 섹션</h3>
  </main>
  <footer>푸터 내용</footer>       {/* main 밖에 위치 */}
</>

// ❌ 잘못된 구조
<main>
  <h1>제목</h1>
  <footer>푸터</footer>            {/* main 안에 footer 금지 */}
</main>
```

---

## 체크리스트

새 페이지를 만들 때마다 확인합니다.

```
□ 'use client' 없이 서버 컴포넌트로 시작
□ metadata 또는 generateMetadata export
□ 페이지별 고유 description (layout과 다르게)
□ alternates.canonical URL 명시
□ <main> 래퍼 + 페이지당 <h1> 하나
□ <footer>는 <main> 밖에
□ 이미지에 alt 속성
□ 외부 링크에 rel="noopener noreferrer"
□ OG 이미지는 1200×630px
□ 클라이언트 기능은 별도 컴포넌트로 분리
```

---

## 현재 layout.tsx에 포함된 전역 설정

별도 처리 없이 모든 페이지에 자동 적용됩니다.

| 항목 | 내용 |
|------|------|
| Title template | `%s \| happyphysicsclub` |
| OpenGraph | 기본 이미지, 사이트명, locale |
| Twitter Card | `summary_large_image` |
| JSON-LD | Organization 스키마 |
| robots | index/follow 허용, Googlebot 최적화 |
| icons | favicon, apple-touch-icon, mask-icon |
| Google 인증 | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env |
