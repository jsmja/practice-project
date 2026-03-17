import { SectionCard } from '@/components/common/SectionCard';
import { MOCK_RECOMMENDED_ACTIONS } from '@/mocks/dashboard';
import { Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AiRecommendationsSection() {
  const navigate = useNavigate();
  const recommendations = MOCK_RECOMMENDED_ACTIONS;

  return (
    <SectionCard
      title="추천 액션"
      titleRight={
        <div className="flex items-center gap-1.5 text-sm text-indigo-500">
          <Lightbulb size={14} />
          <span className="font-medium">AI 분석 기반</span>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex h-full flex-col rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5"
          >
            <div className="mb-3 flex items-start gap-2.5">
              <Lightbulb size={18} className="mt-0.5 flex-shrink-0 text-indigo-500" />
              <p className="text-sm font-semibold text-foreground">{rec.title}</p>
            </div>
            <p className="mb-4 flex-1 pl-7 text-sm leading-relaxed text-muted-foreground">
              {rec.description}
            </p>
            <div className="flex items-center justify-between pl-7">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={14} className="text-green-500" />
                <span className="font-medium text-green-600">{rec.impact}</span>
              </div>
              <button
                onClick={() => navigate(rec.actionPath)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
              >
                {rec.action} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
