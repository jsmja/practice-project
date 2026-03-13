#!/usr/bin/env bash
# =============================================================================
# 기획 검수 스크립트
# 기획서(SKILL.md) 기준으로 화면 및 기능 구현 여부를 자동으로 검수합니다.
# =============================================================================

set +e

PASS=0
FAIL=0
WARN=0
CRITICAL_FAIL=0

# GitHub Actions Summary 파일 경로 (로컬 실행 시 /dev/null)
SUMMARY="${GITHUB_STEP_SUMMARY:-/dev/null}"

# ─── 헬퍼 함수 ────────────────────────────────────────────────────────────────

check() {
  local name="$1"
  local cmd="$2"
  local critical="${3:-false}"

  if eval "$cmd" > /dev/null 2>&1; then
    echo "  ✅  $name"
    echo "| ✅ | $name |" >> "$SUMMARY"
    PASS=$((PASS + 1))
  else
    if [ "$critical" = "true" ]; then
      echo "  ❌  [CRITICAL] $name"
      echo "| ❌ | **[CRITICAL]** $name |" >> "$SUMMARY"
      CRITICAL_FAIL=$((CRITICAL_FAIL + 1))
    else
      echo "  ⚠️   $name"
      echo "| ⚠️ | $name |" >> "$SUMMARY"
      WARN=$((WARN + 1))
    fi
    FAIL=$((FAIL + 1))
  fi
}

section() {
  local title="$1"
  echo ""
  echo "▶ $title"
  echo "" >> "$SUMMARY"
  echo "### $title" >> "$SUMMARY"
  echo "| 결과 | 항목 |" >> "$SUMMARY"
  echo "|:---:|---|" >> "$SUMMARY"
}

# ─── 헤더 ─────────────────────────────────────────────────────────────────────

echo ""
echo "============================================="
echo "  기획 검수 (Planner Review)"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================="

{
  echo "# 🔍 기획 검수 보고서"
  echo ""
  echo "> 기획서(SKILL.md) 기준으로 화면 및 기능 구현 여부를 자동 검수합니다."
  echo ""
  echo "**검수 일시:** $(date '+%Y-%m-%d %H:%M:%S')"
  echo ""
} >> "$SUMMARY"

# =============================================================================
# 1. 라우팅 및 페이지 존재 여부
# =============================================================================
section "1. 페이지 및 라우팅"

check "대시보드 페이지 존재" \
  "test -f src/pages/DashboardPage.tsx" true

check "CRM 관리 페이지 존재" \
  "test -f src/pages/marketing/CrmManagementPage.tsx" true

check "CRM 캠페인 만들기 폼 존재" \
  "test -f src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "포인트 관리 페이지 존재" \
  "test -f src/pages/settings/PointManagementPage.tsx" true

check "구독현황 페이지 존재" \
  "test -f src/pages/payment/SubscriptionPage.tsx" true

check "서비스 신청 페이지 존재" \
  "test -f src/pages/payment/ServiceApplyPage.tsx" true

check "CRM 발송 통계 페이지 존재" \
  "test -f src/pages/statistics/CrmStatisticsPage.tsx" true

check "App.tsx에 /marketing/crm 라우트 등록" \
  "grep -q '/marketing/crm' src/App.tsx" true

check "App.tsx에 /settings/points 라우트 등록" \
  "grep -q '/settings/points' src/App.tsx" true

# =============================================================================
# 2. CRM 캠페인 유형 7종 구현
# =============================================================================
section "2. CRM 캠페인 유형 7종"

check "캠페인 유형 - 커스텀 캠페인" \
  "grep -rq '커스텀 캠페인' src/" true

check "캠페인 유형 - 웰컴백 캠페인" \
  "grep -rq '웰컴백 캠페인' src/" true

check "캠페인 유형 - 신규회원 이탈방지" \
  "grep -rq '신규회원 이탈방지' src/" true

check "캠페인 유형 - 재구매 유도" \
  "grep -rq '재구매 유도' src/" true

check "캠페인 유형 - 구매 감사" \
  "grep -rq '구매 감사' src/" true

check "캠페인 유형 - 생일 축하" \
  "grep -rq '생일 축하' src/" true

check "캠페인 유형 - VIP 전용" \
  "grep -rq 'VIP 전용' src/" true

check "생일 축하 자동 설정 처리 (birthday)" \
  "grep -q \"id.*birthday\\|birthday.*자동\" src/pages/marketing/CrmCampaignCreatePage.tsx" true

# =============================================================================
# 3. CRM 5단계 등록 폼
# =============================================================================
section "3. CRM 5단계 등록 폼"

check "5단계 폼 - 최종 확인 단계 존재" \
  "grep -q '최종 확인' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "5단계 폼 - 수신 대상 설정 단계 존재" \
  "grep -q '수신 대상' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "5단계 폼 - 메시지 작성 단계 존재" \
  "grep -q '메시지' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "5단계 폼 - 발송 설정 단계 존재" \
  "grep -q '발송 설정\\|발송 일정' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "유형별 동적 필터 - 회원 등급 필터" \
  "grep -q 'grade' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "유형별 동적 필터 - 최종 접속일 필터" \
  "grep -q 'lastVisit' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "유형별 동적 필터 - 구매 이력 필터" \
  "grep -q 'purchase' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "예상 비용(포인트) 표시" \
  "grep -q 'estimatedCost\\|예상.*비용\\|예상.*포인트' src/pages/marketing/CrmCampaignCreatePage.tsx" true

# =============================================================================
# 4. 발송 상태 관리
# =============================================================================
section "4. 발송 상태 (CAMPAIGN_STATUS)"

check "상태값 - 대기(PENDING)" \
  "grep -q 'PENDING.*대기\\|대기' src/models/type/index.ts" true

check "상태값 - 발송중(SENDING)" \
  "grep -q 'SENDING.*발송중\\|발송중' src/models/type/index.ts" true

check "상태값 - 완료(SENT)" \
  "grep -q \"SENT.*'완료'\\|'완료'\" src/models/type/index.ts" true

check "상태값 - 실패(FAILED)" \
  "grep -q 'FAILED.*실패\\|실패' src/models/type/index.ts" true

check "CRM 관리 리스트에 상태 필터 적용" \
  "grep -q '대기\\|발송중\\|완료' src/pages/marketing/CrmManagementPage.tsx" true

# =============================================================================
# 5. 포인트 충전/환불 기능
# =============================================================================
section "5. 포인트 충전 및 환불"

check "포인트 충전 모달 구현" \
  "grep -q 'ChargeModal' src/pages/settings/PointManagementPage.tsx" true

check "환불 신청 모달 구현" \
  "grep -q 'RefundModal' src/pages/settings/PointManagementPage.tsx" true

check "충전 금액 옵션 - 10,000원 포함" \
  "grep -q '10000' src/pages/settings/PointManagementPage.tsx" true

check "충전 금액 옵션 - 300,000원 포함" \
  "grep -q '300000' src/pages/settings/PointManagementPage.tsx" true

check "직접 입력 옵션 존재" \
  "grep -q '직접 입력' src/pages/settings/PointManagementPage.tsx" true

check "잔액 경고 - 50,000P 주의 기준 구현" \
  "grep -q '50000' src/pages/settings/PointManagementPage.tsx" true

check "잔액 경고 - 10,000P 위험 기준 구현" \
  "grep -q '10000' src/pages/settings/PointManagementPage.tsx" true

check "포인트 내역 타입 - 충전/차감/환불/만료 뱃지" \
  "grep -q '환불.*info\\|info.*환불' src/pages/settings/PointManagementPage.tsx" true

check "발송 단가 - 텍스트형 15P" \
  "grep -q 'price.*15\\|15.*텍스트' src/pages/settings/PointManagementPage.tsx" true

check "발송 단가 - 이미지형 20P" \
  "grep -q 'price.*20\\|20.*이미지' src/pages/settings/PointManagementPage.tsx" true

check "발송 단가 - 와이드형 25P" \
  "grep -q 'price.*25\\|25.*와이드' src/pages/settings/PointManagementPage.tsx" true

# =============================================================================
# 6. 결제 방식 (토스페이 월정액)
# =============================================================================
section "6. 결제 방식 (토스페이)"

check "서비스 신청 - 토스페이 카드 등록 안내" \
  "grep -q '토스페이' src/pages/payment/ServiceApplyPage.tsx" true

check "서비스 신청 - CRM 포인트 충전 별도 안내" \
  "grep -q '포인트 충전\\|포인트 관리' src/pages/payment/ServiceApplyPage.tsx" true

check "구독현황 - 토스페이 등록 카드 표시" \
  "grep -q '토스페이' src/pages/payment/SubscriptionPage.tsx" true

check "구독현황 - 포인트 잔액 현황 표시" \
  "grep -q 'MOCK_POINT_BALANCE\\|포인트 잔액' src/pages/payment/SubscriptionPage.tsx" true

check "사이드바 - 유료서비스 하위 포인트 충전 메뉴" \
  "grep -q '포인트 충전' src/components/common/Sidebar.tsx" true

# =============================================================================
# 7. 메시지 유형 5종 (브랜드 메시지)
# =============================================================================
section "7. 브랜드 메시지 유형 5종"

check "텍스트형 메시지 구현" \
  "grep -rq '텍스트형' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "이미지형 메시지 구현" \
  "grep -rq '이미지형' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "와이드 이미지형 구현" \
  "grep -rq '와이드 이미지형' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "와이드 아이템 리스트형 구현" \
  "grep -rq '와이드 아이템 리스트형' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "캐러셀 피드형 구현" \
  "grep -rq '캐러셀 피드형' src/pages/marketing/CrmCampaignCreatePage.tsx" true

check "와이드형 글자 제한 76자" \
  "grep -q '76' src/pages/marketing/CrmCampaignCreatePage.tsx" false

check "텍스트/이미지형 글자 제한 400자" \
  "grep -q '400' src/pages/marketing/CrmCampaignCreatePage.tsx" false

# =============================================================================
# 8. 데이터 모델 및 Mock 데이터
# =============================================================================
section "8. 데이터 모델 및 Mock 데이터"

check "ICampaignDto 타입 정의 존재" \
  "grep -rq 'ICampaignDto' src/models/interface/dto/" true

check "IPointHistoryDto 타입 정의 존재" \
  "grep -rq 'IPointHistoryDto' src/models/interface/dto/" true

check "포인트 Mock - 충전 내역 포함" \
  "grep -q \"type.*'충전'\\|충전.*type\" src/mocks/points.ts" false

check "포인트 Mock - 환불 내역 포함" \
  "grep -q \"type.*'환불'\\|환불.*type\" src/mocks/points.ts" false

check "캠페인 Mock - 7종 유형 반영" \
  "grep -q '웰컴백 캠페인\\|VIP 전용' src/mocks/campaigns.ts" false

# =============================================================================
# 결과 요약
# =============================================================================

TOTAL=$((PASS + FAIL))

echo ""
echo "============================================="
echo "  검수 결과 요약"
echo "  통과: $PASS / 전체: $TOTAL"
echo "  (CRITICAL 실패: $CRITICAL_FAIL, 경고: $WARN)"
echo "============================================="
echo ""

{
  echo ""
  echo "---"
  echo ""
  echo "## 📊 검수 결과 요약"
  echo ""
  echo "| 구분 | 수 |"
  echo "|---|:---:|"
  echo "| ✅ 통과 | $PASS |"
  echo "| ❌ CRITICAL 실패 | $CRITICAL_FAIL |"
  echo "| ⚠️ 경고 | $WARN |"
  echo "| **전체** | **$TOTAL** |"
  echo ""
  if [ $CRITICAL_FAIL -gt 0 ]; then
    echo "> ❌ **CRITICAL 항목 $CRITICAL_FAIL개가 실패했습니다. 기획 요건이 미구현된 기능이 있습니다.**"
  else
    echo "> ✅ **모든 CRITICAL 항목이 통과했습니다.**"
  fi
} >> "$SUMMARY"

# CRITICAL 실패가 있으면 exit 1
if [ $CRITICAL_FAIL -gt 0 ]; then
  echo "❌ CRITICAL 항목 $CRITICAL_FAIL개 실패 - 빌드를 중단합니다."
  exit 1
fi

echo "✅ 기획 검수 통과"
exit 0
