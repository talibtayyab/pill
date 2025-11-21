'use server';

/**
 * @fileOverview Provides general health and lifestyle tips related to the medications the user is taking.
 *
 * - generateHealthTips - A function that generates health tips based on medication names.
 * - GenerateHealthTipsInput - The input type for the generateHealthTips function.
 * - GenerateHealthTipsOutput - The return type for the generateHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthTipsInputSchema = z.object({
  medicationNames: z.array(z.string()).describe('An array of medication names.'),
});
export type GenerateHealthTipsInput = z.infer<typeof GenerateHealthTipsInputSchema>;

const GenerateHealthTipsOutputSchema = z.object({
  healthTips: z.array(z.string()).describe('An array of health and lifestyle tips related to the medications.'),
});
export type GenerateHealthTipsOutput = z.infer<typeof GenerateHealthTipsOutputSchema>;

export async function generateHealthTips(input: GenerateHealthTipsInput): Promise<GenerateHealthTipsOutput> {
  return generateHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthTipsPrompt',
  input: {schema: GenerateHealthTipsInputSchema},
  output: {schema: GenerateHealthTipsOutputSchema},
  prompt: `You are a helpful medical assistant providing health and lifestyle tips related to the user's medications.

  Provide 3 general health and lifestyle tips related to the following medications:
  {{#each medicationNames}}- {{{this}}}
  {{/each}}
  `,
});

const generateHealthTipsFlow = ai.defineFlow(
  {
    name: 'generateHealthTipsFlow',
    inputSchema: GenerateHealthTipsInputSchema,
    outputSchema: GenerateHealthTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
