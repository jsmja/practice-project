---
name: 데이터 모델 명세
description: 포인트, 캠페인, 발송 결과 등의 DB 테이블 구조와 API 엔드포인트를 정의합니다.
---

# 🗂️ 데이터 모델 명세

이 스킬은 카친캠 시스템의 데이터 구조(테이블, 인터페이스, API)를 정의합니다.
화면(디자이너)과 로직(회계사)이 **동일한 데이터 구조**를 바라보기 위해 필요합니다.

---

## 1. 포인트 관련 테이블

### 1.1 포인트 잔액 (point_balance)

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string (UUID) | PK |
| `brandId` | string | 브랜드 ID |
| `currentBalance` | number | 현재 잔액 |
| `totalCharged` | number | 총 충전 누적액 |
| `totalUsed` | number | 총 사용 누적액 |
| `totalRefunded` | number | 총 환불 누적액 |
| `updatedAt` | datetime | 마지막 변경일 |

### 1.2 포인트 내역 (point_transaction)

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string (UUID) | PK |
| `brandId` | string | 브랜드 ID |
| `type` | enum | `CHARGE`, `DEDUCT`, `REFUND`, `EXPIRE` |
| `amount` | number | 거래 금액 |
| `balanceAfter` | number | 거래 후 잔액 |
| `referenceId` | string? | 관련 캠페인/충전 ID |
| `description` | string | 상세 설명 |
| `createdAt` | datetime | 생성일 |
| `expiresAt` | datetime? | 만료일 (충전 건만) |

---

## 2. 캠페인 관련 테이블

### 2.1 캠페인 (campaign)

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string (UUID) | PK |
| `brandId` | string | 브랜드 ID |
| `name` | string | 캠페인명 |
| `type` | enum | 7가지 캠페인 유형 |
| `status` | enum | `DRAFT`, `SCHEDULED`, `SENDING`, `COMPLETED`, `FAILED`, `CANCELLED` |
| `messageType` | enum | `TEXT`, `IMAGE`, `WIDE` |
| `messageContent` | string | 메시지 내용 |
| `messageButtons` | json | 버튼 설정 (최대 5개) |
| `filterConditions` | json | 수신 대상 필터 조건 |
| `scheduledAt` | datetime? | 예약 발송 일시 |
| `sentAt` | datetime? | 실제 발송 일시 |
| `targetCount` | number | 대상 수신자 수 |
| `estimatedCost` | number | 예상 비용(포인트) |
| `createdAt` | datetime | 생성일 |
| `updatedAt` | datetime | 수정일 |

### 2.2 캠페인 유형 enum

```typescript
type CampaignType =
  | 'CUSTOM'           // 커스텀 캠페인
  | 'INACTIVE'         // 장기 미접속
  | 'BIRTHDAY'         // 생일 축하
  | 'PURCHASE_THANKS'  // 구매 감사
  | 'REPURCHASE'       // 재구매 유도
  | 'WELCOME'          // 신규 가입 환영
  | 'VIP';             // VIP 전용
```

---

## 3. 발송 결과 테이블

### 3.1 발송 결과 (send_result)

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | string (UUID) | PK |
| `campaignId` | string | FK → campaign |
| `totalSent` | number | 총 발송 건수 |
| `successCount` | number | 성공 건수 |
| `failCount` | number | 실패 건수 |
| `clickCount` | number | 클릭 건수 |
| `conversionCount` | number | 구매 전환 건수 |
| `conversionAmount` | number | 전환 매출액 |
| `refundedPoints` | number | 환불된 포인트 |
| `completedAt` | datetime | 결과 확정일 |

---

## 4. TypeScript 인터페이스

### 4.1 포인트 관련

```typescript
// models/interface/dto/IPointBalanceDto.ts
interface IPointBalanceDto {
  id: string;
  brandId: string;
  currentBalance: number;
  totalCharged: number;
  totalUsed: number;
  totalRefunded: number;
  updatedAt: string;
}

// models/interface/dto/IPointTransactionDto.ts
interface IPointTransactionDto {
  id: string;
  type: 'CHARGE' | 'DEDUCT' | 'REFUND' | 'EXPIRE';
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  description: string;
  createdAt: string;
  expiresAt?: string;
}

// models/interface/req/IPointChargeReq.ts
interface IPointChargeReq {
  amount: number;
  paymentMethod: string;
}
```

### 4.2 캠페인 관련

```typescript
// models/interface/dto/ICampaignDto.ts
interface ICampaignDto {
  id: string;
  brandId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  messageType: 'TEXT' | 'IMAGE' | 'WIDE';
  messageContent: string;
  messageButtons: IMessageButton[];
  filterConditions: IFilterCondition;
  scheduledAt?: string;
  sentAt?: string;
  targetCount: number;
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

// models/interface/req/ICampaignCreateReq.ts
interface ICampaignCreateReq {
  name: string;
  type: CampaignType;
  messageType: 'TEXT' | 'IMAGE' | 'WIDE';
  messageContent: string;
  messageButtons?: IMessageButton[];
  filterConditions: IFilterCondition;
  scheduledAt?: string;
}
```

---

## 5. API 엔드포인트 목록

### 5.1 포인트 API

| Method | Path | 설명 |
|---|---|---|
| `GET` | `/api/points/balance` | 현재 잔액 조회 |
| `GET` | `/api/points/transactions` | 포인트 내역 목록 |
| `POST` | `/api/points/charge` | 포인트 충전 |
| `POST` | `/api/points/refund` | 수동 환불 신청 |

### 5.2 캠페인 API

| Method | Path | 설명 |
|---|---|---|
| `GET` | `/api/campaigns` | 캠페인 목록 조회 |
| `GET` | `/api/campaigns/:id` | 캠페인 상세 조회 |
| `POST` | `/api/campaigns` | 캠페인 등록 |
| `PUT` | `/api/campaigns/:id` | 캠페인 수정 |
| `DELETE` | `/api/campaigns/:id` | 캠페인 삭제 |
| `POST` | `/api/campaigns/:id/copy` | 캠페인 복사 |
| `POST` | `/api/campaigns/:id/send` | 캠페인 발송 |

### 5.3 발송 결과 API

| Method | Path | 설명 |
|---|---|---|
| `GET` | `/api/campaigns/:id/result` | 발송 결과 조회 |
| `GET` | `/api/dashboard/stats` | 대시보드 통계 |

> [!NOTE]
> 테이블 구조와 API 엔드포인트는 초안이며, 실제 백엔드 구현에 맞춰 업데이트해야 합니다.
