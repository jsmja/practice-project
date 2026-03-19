---
name: 헤이데어 디자인 시스템
description: 헤이데어(n-heythere-front) 프로젝트의 UI/디자인 규칙을 정의합니다. CLAUDE.md 기반의 색상·폰트·레이아웃·컴포넌트 패턴을 포함합니다.
---

# 🎨 헤이데어 디자인 시스템

이 스킬은 헤이데어(n-heythere-front) 프로젝트에서 UI를 만들 때 반드시 따라야 하는 디자인 시스템 규칙입니다.

---

## 1. 기술 스택

| 항목 | 도구 | 버전 |
|---|---|---|
| CSS 프레임워크 | Tailwind CSS | 3.4.17 |
| UI 컴포넌트 | shadcn | 2.3.0 |
| 상태 관리 | Zustand + React Query | - |
| 폼 처리 | React Hook Form + Zod | - |
| 빌드 도구 | Vite | - |

### shadcn 컴포넌트 설치

```bash
npx shadcn@2.3.0 add [컴포넌트명]
```

---

## 2. 컴포넌트 규칙

### 2.1 함수형 컴포넌트 전용
- **함수형 컴포넌트 + React Hooks** 사용 (class 컴포넌트 금지)
- Props는 반드시 명확한 타입 정의
- 재사용 가능한 로직은 **custom hook**으로 추출
- 조건부 렌더링은 **early return** 선호

### 2.2 className 조합
- className 조합 시 반드시 `cn` 유틸 사용
```typescript
import { cn } from '@/lib/utils';

// 사용 예시
<div className={cn('base-class', isActive && 'active-class', className)} />
```

### 2.3 공통 컴포넌트 (필수 사용)
| 컴포넌트 | 용도 |
|---|---|
| `NumberRenderer` | 숫자 표시 |
| `DateTimeRenderer` | 날짜/시간 표시 |
| `MemberGradeTag` | 회원 등급 표시 |
| `MemberStatusTag` | 회원 상태 표시 |
| `ColorPicker` | 색상 선택 |

이미 존재하는 공통 컴포넌트가 있으면 반드시 재사용하고, 새로 만들지 마세요.

---

## 3. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `UserProfile`, `HTBrandCard` |
| 함수/변수 | camelCase | `getUserData`, `isLoading` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 인터페이스 | I + PascalCase | `IUserDto` |
| 타입 | *Type suffix | `UserType` |
| 파일명 | kebab-case 또는 PascalCase | `user-profile.tsx` 또는 `UserProfile.tsx` |
| 폴더명 | snake_case | `point_management` |
| CSS 클래스 | kebab-case | `card-header` |

---

## 4. 폴더 구조

```
src/
├── assets/              # 정적 리소스
│   ├── icons/           # ic_*.png 형식
│   └── index.ts         # 에셋 export
├── components/
│   ├── common/          # 공통 컴포넌트
│   └── pages/           # 페이지별 컴포넌트
│       └── [page-name]/ # 각 페이지 폴더
├── hooks/
│   ├── client/[name]/   # API client hooks
│   └── providers/       # provider hooks
├── models/
│   ├── interface/       # 요청/응답/DTO
│   │   ├── req/         # I[Name]Req.ts
│   │   ├── res/         # I[Name]Res.ts
│   │   └── dto/         # I[Name]Dto.ts
│   └── type/            # 타입 모음
├── pages/               # [PageName]Page.tsx
├── routers/
├── store/
└── translations/
```

---

## 5. 페이지 구조 패턴

### 5.1 기본 페이지 구성
```
pages/[PageName]Page.tsx           ← 페이지 진입점
components/pages/[page-name]/     ← 페이지별 컴포넌트
```

- 각 페이지는 `Page` 공통 컴포넌트로 레이아웃 래핑
- 각 페이지별 `README.md` 문서 작성

### 5.2 Store 패턴 (Zustand)
```typescript
// 페이지별 store: create[PageName]Store 형태
const useStore = useCreateStore(createPointManagementStore);
const vm = useViewModel(); // ViewModel context 접근
```

### 5.3 ViewModel 패턴 (선택 적용)
- Page 컴포넌트가 커지거나 역할이 과도할 때만 적용
- 무조건 적용하지 않음

### 5.4 Schema 패턴 (Zod + usePage)
```typescript
// use[ModelName]Schema.ts에서 zod 스키마 정의
// usePage 훅에서 tv (다국어 함수) 활용
```

---

## 6. 코드 스타일 필수 규칙

- **함수형/선언형 패턴** 선호 (class 지양)
- **코드 중복 방지**, 모듈화 선호
- **템플릿 리터럴** 사용 (문자열 연결 대신)
- 조건문은 **항상 중괄호** 사용
- **any 사용 지양** (불가피하면 최소 범위 + 이유 명시)
- **enum 대신** map/object 패턴 선호

---

## 7. Import 규칙

```typescript
// 외부 라이브러리
import { useState } from 'react';

// 프로젝트 내부 (절대 경로)
import { cn } from '@/lib/utils';
import { IUserDto } from '@/models/interface/dto/IUserDto';

// 같은 폴더 (상대 경로 허용)
import { PointCard } from './PointCard';

// ❌ 금지: 복잡한 상대 경로
// import { something } from '../../../../shared/utils';
```

---

## 8. 모노레포 패키지 참조

| 패키지 | 용도 | import 경로 |
|---|---|---|
| `packages/models` | 공통 타입 정의 | `@lunasoft-org/models` |
| `packages/components` | 공통 UI 컴포넌트 | `@lunasoft-org/components` |
| `packages/front-core` | 핵심 유틸/훅 | `@lunasoft-org/front-core` |
| `packages/blank-canvas-ui` | UI 라이브러리 | `@lunasoft-org/blank-canvas-ui` |

### front-core 에서 자주 사용하는 것
- `useViewModel` — ViewModel context 접근
- `useCreateStore` — Store 인스턴스 생성
- `util` — 공통 유틸리티

---

## 9. i18n (다국어)

- `usePage`에서 뽑은 `t` 함수는 `PageProvider`의 `pageCode`를 namespace로 사용
- **namespace를 생략**하고 사용

---

## 10. 에셋 관리

- 아이콘: `assets/icons/ic_*.png` 형식
- `assets/index.ts`에서 일괄 export
- 이미지 업로드: `useUploadImageClient` 훅 사용
