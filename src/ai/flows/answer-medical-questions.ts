'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering medical questions related to medications.
 *
 * It includes:
 * - `answerMedicalQuestions`: A function that takes a user's medical question and returns an answer with a disclaimer.
 * - `AnswerMedicalQuestionsInput`: The input type for the `answerMedicalQuestions` function.
 * - `AnswerMedicalQuestionsOutput`: The output type for the `answerMedicalQuestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerMedicalQuestionsInputSchema = z.object({
  question: z.string().describe('The medical question asked by the user.'),
});
export type AnswerMedicalQuestionsInput = z.infer<typeof AnswerMedicalQuestionsInputSchema>;

const AnswerMedicalQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the medical question, including a disclaimer.'),
});
export type AnswerMedicalQuestionsOutput = z.infer<typeof AnswerMedicalQuestionsOutputSchema>;

export async function answerMedicalQuestions(input: AnswerMedicalQuestionsInput): Promise<AnswerMedicalQuestionsOutput> {
  return answerMedicalQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerMedicalQuestionsPrompt',
  input: {schema: AnswerMedicalQuestionsInputSchema},
  output: {schema: AnswerMedicalQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant providing information related to medical questions.

  Question: {{{question}}}

  Include the following disclaimer at the end of your response: "This information is for general knowledge and informational purposes only, and does not constitute medical advice. It is essential to consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment."`,
});

const answerMedicalQuestionsFlow = ai.defineFlow(
  {
    name: 'answerMedicalQuestionsFlow',
    inputSchema: AnswerMedicalQuestionsInputSchema,
    outputSchema: AnswerMedicalQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
