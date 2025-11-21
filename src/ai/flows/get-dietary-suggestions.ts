// src/ai/flows/get-dietary-suggestions.ts
'use server';

/**
 * @fileOverview Provides dietary suggestions (foods to eat/avoid) based on the medication name.
 *
 * - getDietarySuggestions - A function that provides dietary suggestions based on medication.
 * - GetDietarySuggestionsInput - The input type for the getDietarySuggestions function.
 * - GetDietarySuggestionsOutput - The return type for the getDietarySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetDietarySuggestionsInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication.'),
});
export type GetDietarySuggestionsInput = z.infer<
  typeof GetDietarySuggestionsInputSchema
>;

const GetDietarySuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Dietary suggestions including foods to eat and avoid while taking the medication.'
    ),
});
export type GetDietarySuggestionsOutput = z.infer<
  typeof GetDietarySuggestionsOutputSchema
>;

export async function getDietarySuggestions(
  input: GetDietarySuggestionsInput
): Promise<GetDietarySuggestionsOutput> {
  return getDietarySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDietarySuggestionsPrompt',
  input: {schema: GetDietarySuggestionsInputSchema},
  output: {schema: GetDietarySuggestionsOutputSchema},
  prompt: `Provide dietary suggestions, including foods to eat and foods to avoid, for a patient taking {{medicationName}}.`,
});

const getDietarySuggestionsFlow = ai.defineFlow(
  {
    name: 'getDietarySuggestionsFlow',
    inputSchema: GetDietarySuggestionsInputSchema,
    outputSchema: GetDietarySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
