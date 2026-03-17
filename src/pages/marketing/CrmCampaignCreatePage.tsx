import { useState } from 'react';
import { Users, FileText, Send, Check, Sparkles } from 'lucide-react';
import { WizardEditorLayout } from '@/components/common/WizardEditorLayout';
import { CampaignTypeStep } from '@/components/pages/crm-campaign/CampaignTypeStep';
import { CampaignRecipientStep, INITIAL_RECIPIENT_FILTER } from '@/components/pages/crm-campaign/CampaignRecipientStep';
import { CampaignMessageStep } from '@/components/pages/crm-campaign/CampaignMessageStep';
import { CampaignSendStep } from '@/components/pages/crm-campaign/CampaignSendStep';
import { CampaignConfirmStep } from '@/components/pages/crm-campaign/CampaignConfirmStep';
import { CampaignPreviewPanel } from '@/components/pages/crm-campaign/CampaignPreviewPanel';
import type { IRecipientFilter } from '@/components/pages/crm-campaign/CampaignRecipientStep';
import type { IButton, ICarouselCard, IWideItem } from '@/components/pages/crm-campaign/CampaignMessageStep';
import type { IWizardStep } from '@/components/common/WizardStepIndicator';

const STEPS: IWizardStep[] = [
  { id: 1, label: '캠페인 유형', icon: <Sparkles size={14} /> },
  { id: 2, label: '수신 대상', icon: <Users size={14} /> },
  { id: 3, label: '메시지 작성', icon: <FileText size={14} /> },
  { id: 4, label: '발송 설정', icon: <Send size={14} /> },
  { id: 5, label: '최종 확인', icon: <Check size={14} /> },
];

const MESSAGE_TYPE_NAMES: Record<string, string> = {
  text: '텍스트형',
  image: '이미지형',
  'wide-image': '와이드 이미지형',
  'wide-item-list': '와이드 아이템 리스트형',
  carousel: '캐러셀 피드형',
};

interface ICrmCampaignCreateFormProps {
  onCancel: () => void;
  onComplete: () => void;
}

export function CrmCampaignCreateForm({ onCancel, onComplete }: ICrmCampaignCreateFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');

  // Step 1
  const [selectedCampaignTypeId, setSelectedCampaignTypeId] = useState<string | null>(null);

  // Step 2
  const [recipientFilter, setRecipientFilter] = useState<IRecipientFilter>(INITIAL_RECIPIENT_FILTER);

  // Step 3
  const [selectedMessageTypeId, setSelectedMessageTypeId] = useState<string | null>(null);
  const [bodyText, setBodyText] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [buttons, setButtons] = useState<IButton[]>([]);
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponName, setCouponName] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [wideItems, setWideItems] = useState<IWideItem[]>([
    { id: 1, title: '', description: '', imageUploaded: false },
    { id: 2, title: '', description: '', imageUploaded: false },
  ]);
  const [carouselCards, setCarouselCards] = useState<ICarouselCard[]>([
    { id: 1, title: '', description: '', imageUploaded: false, buttons: [] },
    { id: 2, title: '', description: '', imageUploaded: false, buttons: [] },
  ]);

  // Step 4
  const [sendOption, setSendOption] = useState<'now' | 'reserved'>('now');
  const [sendDate, setSendDate] = useState('');
  const [sendTime, setSendTime] = useState('');

  const canNext: Record<number, boolean> = {
    1: !!selectedCampaignTypeId,
    2: true,
    3: !!selectedMessageTypeId && bodyText.trim().length > 0,
    4: sendOption === 'now' || (!!sendDate && !!sendTime),
  };

  return (
    <WizardEditorLayout
      name={campaignName}
      namePlaceholder="캠페인 이름을 입력하세요"
      onNameChange={setCampaignName}
      onBack={onCancel}
      onDraftSave={() => {}}
      steps={STEPS}
      currentStep={currentStep}
      onStepClick={setCurrentStep}
      onPrev={() => setCurrentStep((prev) => prev - 1)}
      onNext={() => {
        if (canNext[currentStep]) {
          setCurrentStep((prev) => prev + 1);
        }
      }}
      canNext={canNext[currentStep]}
      isLastStep={currentStep === 5}
      lastStepLabel="발송하기"
      lastStepIcon={<Send size={14} />}
      onLastStepAction={onComplete}
      preview={
        <CampaignPreviewPanel
          campaignName={campaignName}
          campaignTypeId={selectedCampaignTypeId}
          messageTypeId={selectedMessageTypeId}
          bodyText={bodyText}
          headerText={headerText}
          buttonCount={buttons.length}
          couponEnabled={couponEnabled}
          couponName={couponName}
          sendOption={sendOption}
          sendDate={sendDate}
          sendTime={sendTime}
          currentStep={currentStep}
        />
      }
    >
      {currentStep === 1 && (
        <CampaignTypeStep
          selectedTypeId={selectedCampaignTypeId}
          onSelectType={setSelectedCampaignTypeId}
        />
      )}

      {currentStep === 2 && (
        <CampaignRecipientStep
          campaignTypeId={selectedCampaignTypeId}
          filter={recipientFilter}
          onChange={setRecipientFilter}
        />
      )}

      {currentStep === 3 && (
        <CampaignMessageStep
          selectedMessageTypeId={selectedMessageTypeId}
          onSelectMessageType={setSelectedMessageTypeId}
          bodyText={bodyText}
          onBodyTextChange={setBodyText}
          headerText={headerText}
          onHeaderTextChange={setHeaderText}
          buttons={buttons}
          onButtonsChange={setButtons}
          imageUploaded={imageUploaded}
          onImageUploadedChange={setImageUploaded}
          wideItems={wideItems}
          onWideItemsChange={setWideItems}
          carouselCards={carouselCards}
          onCarouselCardsChange={setCarouselCards}
          couponEnabled={couponEnabled}
          onCouponEnabledChange={setCouponEnabled}
          couponName={couponName}
          onCouponNameChange={setCouponName}
        />
      )}

      {currentStep === 4 && (
        <CampaignSendStep
          sendOption={sendOption}
          onSendOptionChange={setSendOption}
          sendDate={sendDate}
          onSendDateChange={setSendDate}
          sendTime={sendTime}
          onSendTimeChange={setSendTime}
        />
      )}

      {currentStep === 5 && (
        <CampaignConfirmStep
          campaignName={campaignName}
          campaignTypeId={selectedCampaignTypeId}
          messageTypeName={selectedMessageTypeId ? MESSAGE_TYPE_NAMES[selectedMessageTypeId] ?? '' : ''}
          recipientFilter={recipientFilter}
          buttonCount={buttons.length}
          couponEnabled={couponEnabled}
          couponName={couponName}
          sendOption={sendOption}
          sendDate={sendDate}
          sendTime={sendTime}
        />
      )}
    </WizardEditorLayout>
  );
}
