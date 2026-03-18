# Design System — heythere-crm

이 문서는 heythere-crm 프로젝트의 UI 디자인 규칙입니다.
모든 신규 페이지/컴포넌트는 이 규칙을 따릅니다.

---

## 1) 기본 원칙

- **미니멀 & 모던**: 최소한의 장식, 넉넉한 여백, 깔끔한 카드 기반 레이아웃
- **시원시원한 타이포**: 작은 폰트(10px, 11px) 사용 금지, 최소 `text-xs`(12px) 이상
- **일관된 카드 스타일**: `rounded-2xl` + `border-border/60` + `shadow-sm` 통일
- **색상은 의미 기반**: 상태/액션에 따른 색상 사용, 장식 목적의 색상 지양

---

## 2) 카드 (Card)

### 메인 카드 (SectionCard / StatCard / 독립 카드)

```
rounded-2xl border border-border/60 bg-white p-6 shadow-sm
```

### 내부 카드 (섹션 안의 하위 카드)

```
rounded-xl border border-border/60 p-5
```

### 미니 카드 (KPI 요약 등)

```
rounded-xl border border-border/60 px-4 py-3
```

### 특수 카드

| 용도 | 스타일 |
|------|--------|
| 비활성/잠재 상태 | `rounded-xl border border-dashed border-amber-300 bg-amber-50/30` |
| CTA 배너 | `rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4` |
| 추천/AI 카드 | `rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5` |

---

## 3) 타이포그래피

| 용도 | 클래스 |
|------|--------|
| 페이지 제목 (h1) | `text-3xl font-bold tracking-tight text-foreground` |
| 섹션 제목 (h3) | `text-base font-semibold text-foreground` |
| 카드 헤더 (h4) | `text-sm font-semibold text-foreground` |
| 대형 수치 (KPI) | `text-3xl font-bold tracking-tight text-foreground` |
| 중형 수치 | `text-2xl font-bold` |
| 본문/라벨 | `text-sm text-muted-foreground` |
| 보조 텍스트 | `text-xs text-muted-foreground` |
| 변동값 (긍정) | `text-sm font-medium text-emerald-600` |
| 변동값 (부정) | `text-sm font-medium text-red-500` |

### 금지 사항

- `text-[9px]`, `text-[10px]`, `text-[11px]` 사용 금지
- 최소 폰트 사이즈: `text-xs` (12px)

---

## 4) 간격 (Spacing)

| 용도 | 값 |
|------|-----|
| 카드 외부 패딩 | `p-6` (메인), `p-5` (내부) |
| 섹션 타이틀 → 콘텐츠 | `mb-4` ~ `mb-5` |
| 그리드 간격 | `gap-4` ~ `gap-6` |
| 인라인 요소 간격 | `gap-2` ~ `gap-3` |
| 텍스트 계층 간격 | `mt-1` ~ `mt-2.5` |

---

## 5) 아이콘 (Icon)

### 사이즈 기준

| 용도 | 사이즈 |
|------|--------|
| 주요 액션/알림 | `size={18}` |
| 섹션 헤더/리스트 | `size={16}` |
| 인라인/버튼 내부 | `size={14}` ~ `size={15}` |
| 뱃지/컴팩트 | `size={12}` |

### 아이콘 배경 처리

아이콘은 단독 사용하지 않고 **소프트 배경 박스**로 감쌉니다.

```tsx
{/* 기본 */}
<div className="rounded-lg bg-[color]-50 p-2">
  <IconName size={16} className="text-[color]-500" />
</div>

{/* 강조 */}
<div className="rounded-xl bg-[color]-50 p-2.5 text-[color]-600">
  <IconName size={18} />
</div>
```

색상 매핑 예시:
- 인디고: `bg-indigo-50` + `text-indigo-500`
- 블루: `bg-blue-50` + `text-blue-500`
- 앰버: `bg-amber-50` + `text-amber-500`
- 그린: `bg-green-50` + `text-green-600`
- 바이올렛: `bg-violet-50` + `text-violet-500`

---

## 6) 버튼 (Button)

### Primary (주요 액션)

```
rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white
transition-colors hover:bg-indigo-600
```

### Secondary (네비게이션)

```
flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground
```

> ArrowRight 아이콘 `size={14}`과 함께 사용

### Icon Button (Quick Action)

```
rounded-lg p-1.5 text-muted-foreground transition-colors
hover:bg-muted hover:text-foreground
```

### Alert/위험 버튼

```
rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors
bg-red-500 hover:bg-red-600     (destructive)
bg-amber-500 hover:bg-amber-600 (warning)
```

---

## 7) 뱃지 (Badge)

### 성과 뱃지

```
inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium
```

| 레벨 | 색상 |
|------|------|
| 우수 | `text-green-700 bg-green-50 border-green-200` |
| 양호 | `text-blue-700 bg-blue-50 border-blue-200` |
| 개선 필요 | `text-amber-700 bg-amber-50 border-amber-200` |

### 랭킹 뱃지 (TOP 1/2/3)

```
inline-flex h-6 w-12 items-center justify-center rounded-md text-xs font-semibold text-white
```

색상은 순위별 그라데이션: `bg-[color]-500` → `bg-[color]-400` → `bg-[color]-300`

### 상태 인디케이터 (점)

```
h-2 w-2 rounded-full bg-green-400   (활성)
h-2 w-2 rounded-full bg-gray-300    (비활성)
```

---

## 8) 테이블 (Table)

### 컨테이너

```
overflow-hidden rounded-xl border border-border/60
```

### 헤더 행

```
border-b border-border bg-muted/30
```

셀: `px-5 py-3 text-left text-xs font-medium text-muted-foreground`

### 본문 행

```
border-b border-border/50 last:border-0 hover:bg-muted/20
```

셀: `px-5 py-3.5`

### 셀 텍스트

- 기본: `font-medium text-foreground`
- 보조: `text-xs text-muted-foreground`
- 수치 (우측정렬): `text-right font-medium text-[color]-600`

---

## 9) 프로그레스 바 (Progress Bar)

### 수평 바

```tsx
{/* 컨테이너 */}
<div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
  {/* 채움 */}
  <div
    className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### 인라인 바 (테이블 내)

```tsx
<div className="h-2 w-20 overflow-hidden rounded-full bg-blue-100">
  <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${pct}%` }} />
</div>
```

색상 매핑:
- CTR: `bg-blue-100` / `bg-blue-400`
- 전환율: `bg-green-100` / `bg-green-400`
- 동의율: `from-green-400 to-green-500` (그라데이션)

---

## 10) 알림 (Alert)

### 긴급 알림 배너 (severity ≥ 2)

```
rounded-xl border-l-4 px-5 py-3.5 [bg-color]
```

| 타입 | 배경 | 좌측 보더 | 텍스트 |
|------|------|-----------|--------|
| destructive | `bg-red-50` | `border-l-red-500` | `text-red-800` |
| warning | `bg-amber-50` | `border-l-amber-500` | `text-amber-800` |
| info | `bg-blue-50` | `border-l-blue-500` | `text-blue-600` |

### 운영 알림 (severity < 2)

동일한 `rounded-xl border-l-4` 패턴, 배경색 + 좌측 보더 색상으로 구분

---

## 11) CTA (Call-to-Action)

### 전환 유도 배너

```tsx
<div className="flex items-center justify-between rounded-xl border border-indigo-100
  bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4">
  <div className="flex items-center gap-3">
    <Sparkles size={18} className="text-indigo-500" />
    <div>
      <p className="text-sm font-medium text-foreground">메인 메시지</p>
      <p className="mt-0.5 text-xs text-muted-foreground">보조 설명</p>
    </div>
  </div>
  <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white ...">
    액션 <ArrowRight size={14} />
  </button>
</div>
```

---

## 12) 그리드 레이아웃

| 용도 | 클래스 |
|------|--------|
| KPI 카드 (4열) | `grid grid-cols-4 gap-4` |
| 서비스 현황 (3열) | `grid grid-cols-3 gap-4` |
| 좌우 분할 (2열) | `grid grid-cols-2 gap-4` ~ `gap-6` |
| 내부 미니카드 (2열) | `grid grid-cols-2 gap-3` |

---

## 13) 색상 시스템

### 의미 기반 색상

| 의미 | 50 (배경) | 500 (아이콘/액센트) | 600 (텍스트) |
|------|-----------|---------------------|-------------|
| Primary/Action | `indigo-50` | `indigo-500` | `indigo-600` |
| Info | `blue-50` | `blue-500` | `blue-600` |
| Success/긍정 | `green-50` | `green-500` | `green-600` / `emerald-600` |
| Warning | `amber-50` | `amber-500` | `amber-600` |
| Danger/부정 | `red-50` | `red-500` | `red-500` |
| 보조 액센트 | `violet-50` | `violet-500` | `violet-600` |
| 전환/핵심 | `rose-50` | `rose-500` | `rose-600` |

### 그라데이션

- 퍼널 아이콘: `bg-gradient-to-br from-[color]-500 to-[color]-600`
- 요약 바: `bg-gradient-to-r from-indigo-50 via-blue-50 via-amber-50 to-rose-50`
- CTA: `bg-gradient-to-r from-indigo-50 to-purple-50`

---

## 14) 인터랙션

### Hover

- 텍스트 버튼: `hover:text-foreground` (from muted)
- 테이블 행: `hover:bg-muted/20`
- 아이콘 버튼: `hover:bg-muted hover:text-foreground`
- 채널 칩: `hover:border-gray-300` / `hover:opacity-80`

### Transition

- 색상 변경: `transition-colors`
- 범용 애니메이션: `transition-all`
- SVG 애니메이션: `transition-all duration-500`

---

## 15) 투명도 규칙

| 용도 | 값 |
|------|-----|
| 카드 보더 | `border-border/60` |
| 테이블 구분선 | `border-border/50` |
| 비활성 요소 | `opacity-60` |
| 은은한 배경 | `bg-[color]-50/30` |
| 그라데이션 시작 | `from-[color]-50/50` |
