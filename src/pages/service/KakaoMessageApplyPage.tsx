import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ExternalLink, HelpCircle, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useServiceStore } from '@/store/useServiceStore';

const INDUSTRY_OPTIONS = [
  '음식: 식당, 카페, 디저트, 식품 등',
  '쇼핑: 의류, 잡화, 뷰티, 생활용품 등',
  '생활/교육: 학원, 뷰티숍, 인테리어, 세탁 등',
  '건강/병원: 병원, 약국, 피트니스 등',
  '여행/숙박: 여행사, 호텔, 펜션 등',
  '문화/여가: 영화, 공연, 전시, 취미 등',
  '부동산/금융: 부동산, 금융서비스 등',
  '방송/언론: 방송사, 신문사 등',
  '서비스/기타: IT, 컨설팅, 서비스 등',
];

interface ITermsState {
  all: boolean;
  privacy: boolean;
  terms: boolean;
}

export function KakaoMessageApplyPage() {
  const navigate = useNavigate();

  const { kakaoLinked, setKakaoLinked } = useServiceStore();

  // 연동 완료 상태 → 상세 페이지
  if (kakaoLinked) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/service-integration')}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-base font-bold">카카오 브랜드메시지</h1>
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">연동완료</span>
          </div>
        </div>

        {/* 연동 정보 */}
        <section className="rounded-xl border border-border bg-white">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-bold">연동 정보</h2>
          </div>
          <div className="divide-y divide-border px-6">
            <div className="flex items-center gap-6 py-4">
              <span className="w-40 text-sm text-muted-foreground">카카오채널 아이디</span>
              <span className="text-sm font-medium">@heythere_crm</span>
            </div>
            <div className="flex items-center gap-6 py-4">
              <span className="w-40 text-sm text-muted-foreground">채널 산업 분류</span>
              <span className="text-sm font-medium">쇼핑: 의류, 잡화, 뷰티, 생활용품 등</span>
            </div>
            <div className="flex items-center gap-6 py-4">
              <span className="w-40 text-sm text-muted-foreground">비즈니스 채널 인증</span>
              <span className="text-sm font-medium text-green-600">인증 완료</span>
            </div>
            <div className="flex items-center gap-6 py-4">
              <span className="w-40 text-sm text-muted-foreground">연동일</span>
              <span className="text-sm font-medium">2026.03.18</span>
            </div>
            <div className="flex items-center gap-6 py-4">
              <span className="w-40 text-sm text-muted-foreground">080 수신거부 번호</span>
              <span className="text-sm font-medium">080-123-4567</span>
            </div>
          </div>
        </section>

        {/* 발송 현황 요약 */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-sm font-bold">발송 현황</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-2xl font-bold text-primary">1,240</p>
              <p className="mt-1 text-xs text-muted-foreground">총 발송 건수</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-500">92.3%</p>
              <p className="mt-1 text-xs text-muted-foreground">발송 성공률</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <p className="text-2xl font-bold text-foreground">48,500P</p>
              <p className="mt-1 text-xs text-muted-foreground">포인트 잔액</p>
            </div>
          </div>
        </section>

        {/* 연동 해지 / 재신청 */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-2 text-sm font-bold">서비스 관리</h2>
          <p className="mb-4 text-xs text-muted-foreground">연동을 해지하면 메시지 발송이 중단되며, 재신청 시 다시 이용할 수 있습니다.</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setKakaoLinked(false); navigate('/service-integration'); }}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              연동 해지하기
            </button>
            <button
              onClick={() => navigate('/marketing/crm')}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              캠페인 관리로 이동
            </button>
          </div>
        </section>
      </div>
    );
  }

  // 기본정보
  const [channelId, setChannelId] = useState('');
  const [industry, setIndustry] = useState('');
  const [isBusinessChannel, setIsBusinessChannel] = useState(false);
  const [phone, setPhone] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  // 추가정보
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [rejectNumber, setRejectNumber] = useState('');

  // 약관
  const [agreement, setAgreement] = useState<ITermsState>({ all: false, privacy: false, terms: false });
  const [expandedTerm, setExpandedTerm] = useState<'privacy' | 'terms' | null>(null);

  const handleAgreeAll = (checked: boolean) => {
    setAgreement({ all: checked, privacy: checked, terms: checked });
  };

  const handleAgreeSingle = (key: 'privacy' | 'terms', checked: boolean) => {
    const next = { ...agreement, [key]: checked };
    setAgreement({ ...next, all: next.privacy && next.terms });
  };

  const handleSendCode = () => {
    if (phone) setIsCodeSent(true);
  };

  const canSubmit = isBusinessChannel && agreement.privacy && agreement.terms;

  const inputClass =
    'rounded-lg border border-border px-3 py-2 text-sm outline-none transition-colors focus:border-gray-400';

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/service-integration')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-base font-bold">서비스 신청</h1>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
          <ExternalLink size={12} />
          가이드
        </button>
      </div>

      {/* 신청 정보 */}
      <section className="mb-4 rounded-xl border border-border bg-white">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-bold">신청 정보</h2>
        </div>

        <div className="px-6 py-4">
          {/* 기본정보 */}
          <div className="mb-1">
            <p className="text-xs font-semibold text-muted-foreground">기본정보</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              카카오 메시지 서비스를 신청하기 위한 기본 카카오 채널 정보를 입력하는 영역입니다.
            </p>
          </div>

          <div className="divide-y divide-border">
            {/* 카카오채널 검색용 아이디 */}
            <div className="flex items-start gap-6 py-4">
              <div className="w-48 flex-shrink-0 pt-2">
                <span className="text-sm font-medium">카카오채널 검색용 아이디</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="@아이디를 입력해 주세요"
                  className={cn(inputClass, 'w-64')}
                />
              </div>
            </div>

            {/* 채널 산업 분류 */}
            <div className="flex items-start gap-6 py-4">
              <div className="w-48 flex-shrink-0 pt-2">
                <span className="text-sm font-medium">채널 산업 분류</span>
              </div>
              <div className="flex-1">
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={cn(inputClass, 'w-64')}
                >
                  <option value="">카테고리를 선택해 주세요</option>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  수정이 필요하면 카카오 채널 관리자센터에서 변경할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 비즈니스 채널 인증 확인 */}
            <div className="flex items-start gap-6 py-4">
              <div className="w-48 flex-shrink-0 pt-2">
                <span className="text-sm font-medium">비즈니스 채널 인증 확인</span>
              </div>
              <div className="flex-1 space-y-2">
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isBusinessChannel}
                    onChange={(e) => setIsBusinessChannel(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded"
                  />
                  <span className="text-sm">비즈니스 인증을 받은 채널인지 확인합니다.</span>
                </label>
                {!isBusinessChannel && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    인증되지 않은 채널은 메시지를 발송할 수 없으니, 먼저 카카오 채널 관리자센터에서 인증을 받아주세요.
                  </p>
                )}
              </div>
            </div>

            {/* 휴대폰번호 인증 */}
            <div className="flex items-start gap-6 py-4">
              <div className="w-48 flex-shrink-0 pt-2">
                <span className="text-sm font-medium">휴대폰번호 인증</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="휴대폰 번호를 입력해 주세요"
                    className={cn(inputClass, 'w-56')}
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={!phone}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                      phone
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'cursor-not-allowed bg-muted text-muted-foreground',
                    )}
                  >
                    인증번호 요청
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  · 브랜드 메시지 사용을 위한 인증이 한 번 더 필요해요.
                </p>
                <p className="text-xs text-muted-foreground">
                  · 카카오톡 채널 계정 생성 시 인증한 카카오 채널 관리자 휴대폰 번호를 입력하세요.
                </p>
              </div>
            </div>

            {/* 인증번호 입력 */}
            <div className="flex items-start gap-6 py-4">
              <div className="w-48 flex-shrink-0 pt-2">
                <span className="text-sm font-medium">인증번호 입력</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="인증번호를 입력해 주세요"
                  disabled={!isCodeSent}
                  className={cn(
                    inputClass,
                    'w-64',
                    !isCodeSent && 'cursor-not-allowed bg-muted text-muted-foreground',
                  )}
                />
              </div>
            </div>
          </div>

          {/* 추가정보 */}
          <div className="mb-1 mt-6 border-t border-border pt-5">
            <p className="text-xs font-semibold text-muted-foreground">추가정보</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              몇 가지 정보만 더 입력하면 브랜드 메시지 서비스를 신청할 수 있어요.
            </p>
          </div>

          <div className="divide-y divide-border">
            {/* 모바일 메시지 수신동의 항목 */}
            <div className="flex items-start gap-6 py-4">
              <div className="group relative flex w-48 flex-shrink-0 items-start gap-1 pt-2">
                <span className="text-sm font-medium">모바일 메시지 수신동의 항목</span>
                <HelpCircle size={13} className="mt-0.5 flex-shrink-0 cursor-help text-muted-foreground" />
                <div className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden w-80 rounded-lg border border-border/60 bg-white p-3 text-xs leading-relaxed text-muted-foreground shadow-lg group-hover:block">
                  모바일 메시지 수신동의 항목은 고객에게 광고성 정보 수신 동의를 받고 있다는 것을 증명하는 화면 캡쳐 파일입니다.
                  <br /><br />
                  회원가입 페이지의 이용약관 동의 항목 중 "모바일 메시지 수신동의" (또는 카카오톡이 언급된 동의 항목) 체크박스가 포함된 화면을 캡쳐하여 첨부해 주세요.
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted',
                      consentFile && 'border-green-500 bg-green-50',
                    )}
                  >
                    <Upload size={14} />
                    {consentFile ? consentFile.name : '파일 선택하기'}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => setConsentFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <span className="text-xs text-muted-foreground">jpg, png 파일 / 최대 용량 5MB</span>
                </div>
              </div>
            </div>

            {/* 080 무료수신거부 */}
            <div className="flex items-start gap-6 py-4">
              <div className="group relative flex w-48 flex-shrink-0 items-center gap-1 pt-2">
                <span className="text-sm font-medium">080 무료수신거부</span>
                <HelpCircle size={13} className="flex-shrink-0 cursor-help text-muted-foreground" />
                <div className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden w-80 rounded-lg border border-border/60 bg-white p-3 text-xs leading-relaxed text-muted-foreground shadow-lg group-hover:block">
                  광고 메시지에 포함되는 무료 수신거부 번호입니다.
                  <br />고객이 언제든 수신을 거부할 수 있도록 법적으로 반드시 필요합니다.
                  <br /><br />반드시 정식 발급받은 080번호만 입력하세요.
                  <br />부정확한 정보 입력으로 인한 서비스 제한은 신청자 책임입니다.
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={rejectNumber}
                  onChange={(e) => setRejectNumber(e.target.value)}
                  placeholder="번호를 입력해 주세요."
                  className={cn(inputClass, 'w-56')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 약관 동의 */}
      <section className="mb-4 rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-sm font-bold">약관 동의 및 개인정보 수집</h2>

        <label className="mb-3 flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={agreement.all}
            onChange={(e) => handleAgreeAll(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm font-semibold">전체 동의합니다.</span>
        </label>

        <div className="ml-0.5 space-y-3 border-t border-border pt-3">
          {/* 개인정보 동의 */}
          <div>
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={agreement.privacy}
                  onChange={(e) => handleAgreeSingle('privacy', e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm">
                  <span className="font-medium text-blue-600">[필수]</span> 개인정보 수집 이용 동의서에
                  동의합니다.
                </span>
              </label>
              <button
                onClick={() => setExpandedTerm(expandedTerm === 'privacy' ? null : 'privacy')}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                약관 내용 보기
                <ChevronDown
                  size={12}
                  className={cn('transition-transform', expandedTerm === 'privacy' && 'rotate-180')}
                />
              </button>
            </div>
            {expandedTerm === 'privacy' && (
              <div className="mt-2 rounded-lg bg-gray-50 p-4 text-xs leading-relaxed text-muted-foreground">
                <p><span className="font-semibold text-foreground">1. 개인정보의 수집 및 이용 목적</span> : 카카오 브랜드 메시지 발송 서비스 제공</p>
                <p className="mt-2"><span className="font-semibold text-foreground">2. 수집하는 개인정보 항목</span> : 카카오 채널 검색용 아이디, 휴대폰번호(본인 인증용), 080 무료수신거부 번호</p>
                <p className="mt-2"><span className="font-semibold text-foreground">3. 개인정보의 보유 및 이용기간</span> : 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 일정기간 동안 개인정보를 보관할 수 있습니다.</p>
                <p className="mt-3 text-amber-600">* 해당 동의를 거부할 수 있으나, 거부 시 서비스 이용에 제한이 있을 수 있습니다.</p>
              </div>
            )}
          </div>

          {/* 이용약관 동의 */}
          <div>
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={agreement.terms}
                  onChange={(e) => handleAgreeSingle('terms', e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm">
                  <span className="font-medium text-blue-600">[필수]</span> 카카오 메시지 이용약관에
                  동의합니다.
                </span>
              </label>
              <button
                onClick={() => setExpandedTerm(expandedTerm === 'terms' ? null : 'terms')}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                약관 내용 보기
                <ChevronDown
                  size={12}
                  className={cn('transition-transform', expandedTerm === 'terms' && 'rotate-180')}
                />
              </button>
            </div>
            {expandedTerm === 'terms' && (
              <div className="mt-2 rounded-lg bg-gray-50 p-4 text-xs leading-relaxed text-muted-foreground">
                <p className="mb-2 font-semibold text-foreground">브랜드 메시지 발송 관련 주의사항 및 책임에 대한 동의 (필수)</p>
                <p className="mb-3">회원은 아래 사항을 충분히 이해하였으며, 이에 동의합니다.</p>

                <p className="font-semibold text-foreground">1. 신원 정보 및 발신 프로필 관리</p>
                <p className="mb-2">- 회원은 브랜드 메시지를 발송하기 전, 수신자가 발신자를 명확히 식별할 수 있도록 상호, 대표자명, 사업자등록번호 등 신원정보와 발신 프로필을 정확하게 구성해야 하며, 해당 정보에 변경이 발생한 경우 지체 없이 반영하여야 합니다.</p>

                <p className="font-semibold text-foreground">2. 마케팅 수신 동의 확보</p>
                <p className="mb-2">- 회원은 브랜드 메시지 수신자에 대해 관련 법령에 따라 유효한 마케팅 수신 동의를 적법하게 사전에 확보하여야 합니다.</p>

                <p className="font-semibold text-foreground">3. 책임의 귀속</p>
                <p className="mb-2">- 수신 동의의 적법성과 유효성에 대한 책임은 전적으로 회원에게 있으며, 브랜드 메시지 발송 과정에서 수신자 신고, 수신 거부 미처리, 과징금 부과, 민원 제기, 고객응대(CS) 등의 문제가 발생할 경우, 이에 따른 모든 법적·행정적 책임은 회원이 부담합니다.</p>

                <p className="font-semibold text-foreground">4. 금지 행위</p>
                <p className="mb-2">- 회원은 불법 스팸, 스미싱 메시지 전송, 동일 내용의 반복·중복 발송, 또는 브랜드 메시지 서비스 운영에 중대한 지장을 초래하는 기타 행위를 하여서는 아니되며, 이러한 행위가 의심되거나 발견될 경우 회사 또는 카카오가 계정 이용 제한, 서비스 제공 중지 등의 조치를 즉시 취할 수 있음을 확인합니다.</p>

                <p className="font-semibold text-foreground">5. 템플릿 내역 확인에 대한 동의</p>
                <p>- 본인은 회사가 브랜드 메시지 서비스 운영 및 관리 목적상, 본인이 해당 서비스를 통해 제작·이용하는 템플릿의 내역을 확인할 수 있음에 동의합니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 서비스 신청 시 유의사항 */}
      <section className="mb-6 rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Info size={15} className="text-blue-500" />
          서비스 신청 시 유의사항
        </h2>
        <ol className="space-y-4">
          <li>
            <p className="mb-1 text-sm font-semibold">1. 불법 수집 전화번호를 사용한 메시지 발송 금지</p>
            <p className="text-xs text-muted-foreground">
              법적인 방법으로 획득한 전화번호를 사용해 메시지를 발송 시도를 하여서는 안됩니다.
            </p>
          </li>
          <li>
            <p className="mb-1 text-sm font-semibold">2. 수신 동의의 최신화</p>
            <p className="text-xs text-muted-foreground">
              광고성 정보 수신에 동의한 고객 목록은 항상 최신 상태로 유지해야 합니다.
            </p>
          </li>
          <li>
            <p className="mb-1 text-sm font-semibold">3. 전화번호 수집 시 고지사항</p>
            <p className="mb-1.5 text-xs text-muted-foreground">
              회원은 수신자의 전화번호를 수집할 때 아래 사항을 반드시 안내해야 하며, 이미 수집된 번호의 경우
              별도의 공지를 통해 안내해야 합니다.
            </p>
            <ul className="space-y-1 pl-1">
              <li className="flex gap-1.5 text-xs text-muted-foreground">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
                브랜드 메시지를 수신할 때, 와이파이 환경이 아닐 경우 데이터 통신 요금이 발생할 수 있다는 점
              </li>
              <li className="flex gap-1.5 text-xs text-muted-foreground">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" />
                브랜드 메시지 수신을 원하지 않을 경우, 발신자의 고객센터 연락처 등을 통해 수신 거부의사를
                전달할 수 있다는 점
              </li>
            </ul>
          </li>
        </ol>
      </section>

      {/* Submit */}
      <div className="flex justify-center pb-8">
        <button
          disabled={!canSubmit}
          onClick={() => { setKakaoLinked(true); navigate('/service-integration'); }}
          className={cn(
            'rounded-lg px-10 py-3 text-sm font-semibold transition-colors',
            canSubmit
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'cursor-not-allowed bg-muted text-muted-foreground',
          )}
        >
          모두 동의하고 신청하기
        </button>
      </div>
    </div>
  );
}
