import { config } from 'dotenv';
config();

import '@/ai/flows/answer-medical-questions.ts';
import '@/ai/flows/extract-medication-details.ts';
import '@/ai/flows/generate-health-tips.ts';
import '@/ai/flows/get-dietary-suggestions.ts';