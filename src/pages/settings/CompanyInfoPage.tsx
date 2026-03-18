import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { useCompanyInfoStore } from '@/store/useCompanyInfoStore';

export function CompanyInfoPage() {
  const store = useCompanyInfoStore();

  const [companyName, setCompanyName] = useState(store.companyName);
  const [ceoName, setCeoName] = useState(store.ceoName);
  const [homepageUrl, setHomepageUrl] = useState(store.homepageUrl);
  const [businessName, setBusinessName] = useState(store.businessName);
  const [businessType, setBusinessType] = useState(store.businessType);
  const [businessCategory, setBusinessCategory] = useState(store.businessCategory);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    store.setCompanyName(companyName);
    store.setCeoName(ceoName);
    store.setHomepageUrl(homepageUrl);
    store.setBusinessName(businessName);
    store.setBusinessType(businessType);
    store.setBusinessCategory(businessCategory);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCompanyName(store.companyName);
    setCeoName(store.ceoName);
    setHomepageUrl(store.homepageUrl);
    setBusinessName(store.businessName);
    setBusinessType(store.businessType);
    setBusinessCategory(store.businessCategory);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="회사 정보 관리"
        actions={
          isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="rounded-lg border border-border/60 px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                저장하기
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              수정하기
            </button>
          )
        }
      />

      <div className="max-w-2xl space-y-6">
        {/* 회사명 */}
        <FormField
          label="회사명"
          required
          value={companyName}
          onChange={setCompanyName}
          disabled={!isEditing}
          placeholder="회사명을 입력해 주세요."
          maxLength={50}
        />

        {/* 대표자명 */}
        <FormField
          label="대표자명"
          required
          value={ceoName}
          onChange={setCeoName}
          disabled={!isEditing}
          placeholder="대표자명을 입력해 주세요."
          maxLength={30}
        />

        {/* 홈페이지(쇼핑몰) URL */}
        <FormField
          label="홈페이지(쇼핑몰) URL"
          required
          value={homepageUrl}
          onChange={setHomepageUrl}
          disabled={!isEditing}
          placeholder="https://"
        />

        {/* 사업자명 */}
        <FormField
          label="사업자명"
          value={businessName}
          onChange={setBusinessName}
          disabled={!isEditing}
          placeholder="사업자명을 입력해 주세요."
          maxLength={50}
        />

        {/* 업태 업종 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">업태 업종</label>
          <div className="space-y-2">
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              disabled={!isEditing}
              placeholder="업태를 입력해 주세요."
              className={cn(
                'w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm outline-none transition-colors',
                isEditing
                  ? 'bg-white text-foreground focus:border-primary'
                  : 'bg-gray-50 text-foreground'
              )}
            />
            <input
              type="text"
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              disabled={!isEditing}
              placeholder="업종을 입력해 주세요."
              className={cn(
                'w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm outline-none transition-colors',
                isEditing
                  ? 'bg-white text-foreground focus:border-primary'
                  : 'bg-gray-50 text-foreground'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface IFormFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder: string;
  maxLength?: number;
}

function FormField({ label, required, value, onChange, disabled, placeholder, maxLength }: IFormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (maxLength && e.target.value.length > maxLength) return;
            onChange(e.target.value);
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-border/60 px-4 py-2.5 text-sm outline-none transition-colors',
            disabled
              ? 'bg-gray-50 text-foreground'
              : 'bg-white text-foreground focus:border-primary'
          )}
        />
        {maxLength && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
