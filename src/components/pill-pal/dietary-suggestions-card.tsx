import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';
import type { GetDietarySuggestionsOutput } from '@/ai/flows/get-dietary-suggestions';

interface DietarySuggestionsCardProps {
  suggestions: GetDietarySuggestionsOutput;
}

export function DietarySuggestionsCard({ suggestions }: DietarySuggestionsCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UtensilsCrossed className="text-primary" />
          <span>Dietary Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{suggestions.suggestions}</p>
      </CardContent>
    </Card>
  );
}
