import { useState } from 'react';
import { Users, FileText, Send, Sparkles, Settings } from 'lucide-react';
import { WizardEditorLayout } from '@/components/common/WizardEditorLayout';
import { CampaignTypeStep, CAMPAIGN_TYPES } from '@/components/pages/crm-campaign/CampaignTypeStep';
import { CampaignRecipientStep, INITIAL_RECIPIENT_FILTER } from '@/components/pages/crm-campaign/CampaignRecipientStep';
import { CampaignMessageStep } from '@/components/pages/crm-campaign/CampaignMessageStep';
import { CampaignSendStep } from '@/components/pages/crm-campaign/CampaignSendStep';
import { CampaignPreviewPanel } from '@/components/pages/crm-campaign/CampaignPreviewPanel';
import type { IRecipientFilter } from '@/components/pages/crm-campaign/CampaignRecipientStep';
import type { IButton, ICarouselCard, IWideItem } from '@/components/pages/crm-campaign/CampaignMessageStep';
import type { IWizardStep } from '@/components/common/WizardStepIndicator';

function getSteps(campaignTypeId: string | null): IWizardStep[] {
  const campaignType = CAMPAIGN_TYPES.find((t) => t.id === campaignTypeId);
  const badge = campaignType?.name;
  return [
    { id: 1, label: '캠페인 유형', icon: <Sparkles size={14} />, badge },
    { id: 2, label: '메시지 작성', icon: <FileText size={14} /> },
    { id: 3, label: '오디언스 설정', icon: <Users size={14} /> },
    { id: 4, label: '발송 조건 설정', icon: <Settings size={14} /> },
  ];
}

interface ICrmCampaignCreateFormProps {
  onCancel: () => void;
  onComplete: () => void;
}

export function CrmCampaignCreateForm({ onCancel, onComplete }: ICrmCampaignCreateFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');

  // Step 1
  const [selectedCampaignTypeId, setSelectedCampaignTypeId] = useState<string | null>(null);
  const [selectedSubTypeId, setSelectedSubTypeId] = useState<string | null>(null);

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
  const [sendOption, setSendOption] = useState<'once' | 'repeat'>('once');
  const [sendDate, setSendDate] = useState('');
  const [sendTime, setSendTime] = useState('');

  const handleSelectType = (typeId: string) => {
    setSelectedCampaignTypeId(typeId);
    setSelectedSubTypeId(null);
  };

  const canNext: Record<number, boolean> = {
    1: !!selectedCampaignTypeId,
    2: !!selectedMessageTypeId && bodyText.trim().length > 0,
    3: true,
  };

  return (
    <WizardEditorLayout
      name={campaignName}
      namePlaceholder="캠페인 이름을 입력하세요"
      onNameChange={setCampaignName}
      onBack={onCancel}
      onDraftSave={() => {}}
      steps={getSteps(selectedCampaignTypeId)}
      currentStep={currentStep}
      onStepClick={setCurrentStep}
      onPrev={() => setCurrentStep((prev) => prev - 1)}
      onNext={() => {
        if (canNext[currentStep]) {
          setCurrentStep((prev) => prev + 1);
        }
      }}
      canNext={canNext[currentStep]}
      isLastStep={currentStep === 4}
      lastStepLabel="등록하기"
      lastStepIcon={<Send size={14} />}
      onLastStepAction={onComplete}
      preview={
        <CampaignPreviewPanel
          campaignName={campaignName}
          campaignTypeId={selectedCampaignTypeId}
          bodyText={bodyText}
          headerText={headerText}
          buttonCount={buttons.length}
          couponEnabled={couponEnabled}
          couponName={couponName}
          currentStep={currentStep}
          recipientFilter={recipientFilter}
        />
      }
    >
      {currentStep === 1 && (
        <CampaignTypeStep
          selectedTypeId={selectedCampaignTypeId}
          onSelectType={handleSelectType}
          selectedSubTypeId={selectedSubTypeId}
          onSelectSubType={setSelectedSubTypeId}
        />
      )}

      {currentStep === 2 && (
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

      {currentStep === 3 && (
        <CampaignRecipientStep
          campaignTypeId={selectedCampaignTypeId}
          filter={recipientFilter}
          onChange={setRecipientFilter}
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
    </WizardEditorLayout>
  );
}
