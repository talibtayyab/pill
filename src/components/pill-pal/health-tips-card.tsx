import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import type { GenerateHealthTipsOutput } from '@/ai/flows/generate-health-tips';

interface HealthTipsCardProps {
  tips: GenerateHealthTipsOutput;
}

export function HealthTipsCard({ tips }: HealthTipsCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="text-primary" />
          <span>Health & Lifestyle Tips</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 list-disc list-inside text-sm text-foreground/80">
          {tips.healthTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
