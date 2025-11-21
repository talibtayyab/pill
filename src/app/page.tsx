'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Header } from '@/components/pill-pal/header';
import { PrescriptionUploader } from '@/components/pill-pal/prescription-uploader';
import { ResultsDisplay } from '@/components/pill-pal/results-display';
import { Chatbot } from '@/components/pill-pal/chatbot';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import { extractMedicationDetails, type MedicationDetail } from '@/ai/flows/extract-medication-details';
import { getDietarySuggestions, type GetDietarySuggestionsOutput } from '@/ai/flows/get-dietary-suggestions';
import { generateHealthTips, type GenerateHealthTipsOutput } from '@/ai/flows/generate-health-tips';

export type AnalysisResult = {
  medication: MedicationDetail;
  dietarySuggestions: GetDietarySuggestionsOutput;
  healthTips: GenerateHealthTipsOutput;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult[] | null>(null);
  const [currentMedicationIndex, setCurrentMedicationIndex] = useState(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      processFile(droppedFile);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setResults(null);
    setError(null);
    setCurrentMedicationIndex(0);
  }

  const handleAnalyze = async () => {
    if (!preview) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setCurrentMedicationIndex(0);

    try {
      const { medications } = await extractMedicationDetails({ prescriptionImage: preview });
      
      if (!medications || medications.length === 0) {
        setError("No medications found on the prescription. Please try a clearer image.");
        setLoading(false);
        return;
      }
      
      const analysisPromises = medications.map(async (medication) => {
        const [dietarySuggestions, healthTips] = await Promise.all([
          getDietarySuggestions({ medicationName: medication.medicationName }),
          generateHealthTips({ medicationNames: [medication.medicationName] })
        ]);
        return {
          medication,
          dietarySuggestions,
          healthTips,
        };
      });

      const analysisResults = await Promise.all(analysisPromises);
      setResults(analysisResults);

    } catch (e) {
      console.error(e);
      setError('Failed to analyze prescription. The AI model may have had an issue understanding the image. Please try again with a clearer picture.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
    setLoading(false);
    setCurrentMedicationIndex(0);
  }
  
  const handlePrevMedication = () => {
      setCurrentMedicationIndex(prev => (prev > 0 ? prev - 1 : prev));
  }

  const handleNextMedication = () => {
      if (results) {
        setCurrentMedicationIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      }
  }


  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
          <PrescriptionUploader
            preview={preview}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
          />
          
          {error && (
             <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}

          <div className="flex justify-center gap-4">
            <Button onClick={handleAnalyze} disabled={loading || !preview} size="lg">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : 'Analyze Prescription'}
            </Button>
            {(preview || results || error) && (
                <Button onClick={handleReset} variant="outline" size="lg" disabled={loading}>
                    Start Over
                </Button>
            )}
          </div>
          
          {results && results.length > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handlePrevMedication} disabled={currentMedicationIndex === 0} variant="outline">
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Medication {currentMedicationIndex + 1} of {results.length}
              </span>
              <Button onClick={handleNextMedication} disabled={currentMedicationIndex === results.length - 1} variant="outline">
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
          
          <ResultsDisplay loading={loading} results={results ? results[currentMedicationIndex] : null} />
        </div>
      </main>
      <Chatbot />
    </div>
  );
}
