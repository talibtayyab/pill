import { MedicationCard } from './medication-card';
import { DietarySuggestionsCard } from './dietary-suggestions-card';
import { HealthTipsCard } from './health-tips-card';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalysisResult } from '@/app/page';

interface ResultsDisplayProps {
  loading: boolean;
  results: AnalysisResult | null;
}

function LoadingSkeletons() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
                <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/6" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export function ResultsDisplay({ loading, results }: ResultsDisplayProps) {
  if (!loading && !results) {
    return null;
  }

  if (loading) {
    return <LoadingSkeletons />;
  }

  if (results) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        <MedicationCard medication={results.medication} />
        <DietarySuggestionsCard suggestions={results.dietarySuggestions} />
        <HealthTipsCard tips={results.healthTips} />
      </div>
    );
  }

  return null;
}
