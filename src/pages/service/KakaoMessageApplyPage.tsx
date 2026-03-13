import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ExternalLink, HelpCircle, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const INDUSTRY_OPTIONS = [
  '쇼핑몰/이커머스',
  '뷰티/패션',
  '음식/식음료',
  '여행/숙박',
  '교육/문화',
  '헬스/피트니스',
  '엔터테인먼트',
  '금융/보험',
  '부동산',
  '의료/건강',
  '자동차',
  '기타',
];

interface ITermsState {
  all: boolean;
  privacy: boolean;
  terms: boolean;
}

export function KakaoMessageApplyPage() {
  const navigate = useNavigate();

  // 기본정보
  const [channelId, setChannelId] = useState('');
  const [industry, setIndustry] = useState('');
  const [isBusinessChannel, setIsBusinessChannel] = useState<boolean | null>(null);
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

  const canSubmit = agreement.privacy && agreement.terms;

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

            {/* 비즈니스 채널 여부 */}
            <div className="flex items-start gap-6 py-4">
              <div className="w-48 flex-shrink-0 pt-2">
                <span className="text-sm font-medium">비즈니스 채널 여부</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="isBusinessChannel"
                      checked={isBusinessChannel === true}
                      onChange={() => setIsBusinessChannel(true)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">예 (비즈니스 인증 채널)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="isBusinessChannel"
                      checked={isBusinessChannel === false}
                      onChange={() => setIsBusinessChannel(false)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">아니오</span>
                  </label>
                </div>
                {isBusinessChannel === false && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    인증되지 않은 채널은 메시지를 발송할 수 없으니, 먼저 카카오 채널 관리자센터에서 인증을
                    받아주세요.
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
                        ? 'bg-foreground text-white hover:bg-gray-800'
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
              <div className="flex w-48 flex-shrink-0 items-start gap-1 pt-2">
                <span className="text-sm font-medium">모바일 메시지 수신동의 항목</span>
                <HelpCircle size={13} className="mt-0.5 flex-shrink-0 text-muted-foreground" />
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
              <div className="flex w-48 flex-shrink-0 items-center gap-1 pt-2">
                <span className="text-sm font-medium">080 무료수신거부</span>
                <HelpCircle size={13} className="flex-shrink-0 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={rejectNumber}
                    onChange={(e) => setRejectNumber(e.target.value)}
                    placeholder="번호를 입력해 주세요."
                    className={cn(inputClass, 'w-56')}
                  />
                  <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted">
                    080 수신거부 서비스
                    <ExternalLink size={12} />
                  </button>
                </div>
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
              <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-muted-foreground">
                <p>수집 항목: 휴대폰 번호, 카카오 채널 ID, 사업자 정보</p>
                <p className="mt-0.5">수집 목적: 카카오 메시지 서비스 제공 및 본인 확인</p>
                <p className="mt-0.5">보유 기간: 서비스 이용 계약 종료 시까지</p>
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
              <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-muted-foreground">
                카카오 브랜드메시지 서비스 이용약관에 따라 광고성 정보 수신 동의를 받은 사용자에게만 메시지를
                발송할 수 있습니다. 불법 수집 전화번호 사용이 금지되며, 수신 동의 목록은 항상 최신 상태로
                유지해야 합니다.
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
          onClick={() => navigate('/service-integration')}
          className={cn(
            'rounded-lg px-10 py-3 text-sm font-semibold transition-colors',
            canSubmit
              ? 'bg-foreground text-white hover:bg-gray-800'
              : 'cursor-not-allowed bg-muted text-muted-foreground',
          )}
        >
          모두 동의하고 신청하기
        </button>
      </div>
    </div>
  );
}
