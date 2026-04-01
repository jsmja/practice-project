---
name: 코드 품질 규칙
description: 네이밍·구조·성능·에러처리·주석 등 코드 품질 검사 규칙을 정의합니다. QC 담당자가 코드 리뷰 시 이 규칙을 기준으로 검수합니다.
---

# 🔍 코드 품질 규칙

이 스킬은 QC 담당자가 코드를 리뷰할 때 사용하는 검사 기준입니다.
여러 에이전트가 작성한 코드의 **일관성과 유지보수성**을 보장하기 위해 필요합니다.

---

## 1. 파일/폴더 네이밍 규칙

### 1.1 파일 네이밍
| 종류 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 | PascalCase | `PointChargeCard.tsx` |
| 페이지 | PascalCase + Page | `PointManagementPage.tsx` |
| 훅 | camelCase + use 접두사 | `usePointBalance.ts` |
| 모델/인터페이스 | PascalCase + I 접두사 | `IPointBalanceDto.ts` |
| 스키마 | camelCase + Schema | `usePointChargeSchema.ts` |
| 유틸리티 | camelCase | `formatCurrency.ts` |
| 상수 | camelCase | `pointConstants.ts` |

### 1.2 폴더 네이밍
- 폴더명은 **snake_case** 사용
- 예: `point_management/`, `campaign_builder/`, `common_components/`

### 1.3 금지 패턴
- ❌ `temp.tsx`, `test123.ts`, `asdf.tsx`
- ❌ 한국어 파일명
- ❌ 공백이 포함된 파일명

---

## 2. 컴포넌트 구조 규칙

### 2.1 한 파일에 한 컴포넌트
- 하나의 `.tsx` 파일에는 **하나의 export 컴포넌트만** 포함
- 내부 헬퍼 컴포넌트는 같은 파일에 둘 수 있으나 export 하지 않음

### 2.2 Props 타입 정의 필수
```typescript
// ✅ 올바른 예
interface IPointCardProps {
  balance: number;
  onCharge: () => void;
  className?: string;
}

export function PointCard({ balance, onCharge, className }: IPointCardProps) {
  // ...
}

// ❌ 잘못된 예 — props 타입 없음
export function PointCard(props: any) {
  // ...
}
```

### 2.3 컴포넌트 크기 제한
- 한 컴포넌트 파일이 **200줄을 초과**하면 분리를 검토
- 컴포넌트 내부의 로직이 복잡하면 **custom hook으로 추출**

---

## 3. 중복 코드 금지

### 3.1 공통 로직 분리 규칙
| 중복 위치 | 분리 대상 |
|---|---|
| 같은 로직이 2곳 이상 | `hooks/` 또는 `utils/`로 분리 |
| 같은 UI가 2곳 이상 | `components/common/`으로 분리 |
| 같은 API 호출 패턴 | `hooks/client/`로 분리 |
| 같은 상수값 | 상수 파일로 분리 |

### 3.2 검사 방법
- 파일 간 유사한 코드 블록이 있으면 경고
- 복사-붙여넣기된 코드는 반드시 통합

---

## 4. 에러 처리 규칙

### 4.1 API 호출 필수 패턴
```typescript
// ✅ 모든 API 호출에 에러 처리 필수
try {
  const result = await apiClient.getPointBalance();
  return result;
} catch (error) {
  // 사용자에게 보여줄 에러 메시지 표시
  toast.error('포인트 잔액을 불러오는데 실패했습니다.');
  // 에러 로깅
  console.error('포인트 잔액 조회 실패:', error);
}
```

### 4.2 에러 처리 체크리스트
- [ ] 모든 API 호출에 try-catch가 있는가
- [ ] catch 블록에 사용자 친화적 메시지가 있는가
- [ ] console.error로 디버깅용 로그를 남기는가
- [ ] 네트워크 오류와 비즈니스 오류를 구분하는가

---

## 5. 주석 규칙

### 5.1 허용되는 주석
```typescript
// ✅ 비즈니스 로직 설명 (한국어)
// 잔액 부족 시 발송을 자동 중지하고 충전 페이지로 안내
if (balance < estimatedCost) {
  stopSending();
  redirectToCharge();
}

// ✅ TODO/FIXME 주석
// TODO: 캠페인 복사 시 이미지 첨부파일도 함께 복사 필요
```

### 5.2 금지되는 주석
```typescript
// ❌ 코드 설명 주석 (코드를 읽으면 알 수 있는 내용)
// counter 변수를 1 증가시킨다
counter++;

// ❌ 주석 처리된 코드
// const oldFunction = () => { ... };
```

---

## 6. 성능 체크 규칙

### 6.1 불필요한 리렌더링 방지
- `useMemo`, `useCallback`은 필요한 곳에만 사용 (과도한 최적화 지양)
- 부모 컴포넌트의 상태 변경이 자식에게 불필요하게 전파되지 않는지 확인
- 큰 리스트는 가상화(virtualization) 적용 검토

### 6.2 API 호출 최적화
- 같은 데이터를 여러 곳에서 호출하면 React Query 캐시 활용
- 불필요한 재호출이 없는지 확인 (refetch 조건 확인)

---

## 7. 코드 리뷰 보고 양식

검수 완료 후 아래 양식으로 보고합니다:

```
## 코드 리뷰 보고서

- 리뷰 대상: [파일명 또는 기능명]
- 리뷰 일시: YYYY-MM-DD

### 통과 항목
- [규칙별 통과 현황]

### 수정 필요 항목
- 📍 [파일명:라인번호] — [위반 규칙] — [수정 방법]

### 개선 제안 (선택)
- [코드 개선을 위한 제안사항]
```
