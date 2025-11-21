'use server';

/**
 * @fileOverview Extracts medication details (name, dosage, schedule) from an image of a prescription.
 *
 * - extractMedicationDetails - A function that takes an image of a prescription and returns the medication details.
 * - ExtractMedicationDetailsInput - The input type for the extractMedicationDetails function.
 * - ExtractMedicationDetailsOutput - The return type for the extractMedicationDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractMedicationDetailsInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      'A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type ExtractMedicationDetailsInput = z.infer<typeof ExtractMedicationDetailsInputSchema>;

const MedicationDetailSchema = z.object({
  medicationName: z.string().describe('The name of the medication.'),
  dosage: z.string().describe('The dosage of the medication.'),
  schedule: z.string().describe('The schedule of the medication.'),
});

const ExtractMedicationDetailsOutputSchema = z.object({
  medications: z.array(MedicationDetailSchema).describe("An array of all medications found on the prescription.")
});
export type ExtractMedicationDetailsOutput = z.infer<typeof ExtractMedicationDetailsOutputSchema>;
export type MedicationDetail = z.infer<typeof MedicationDetailSchema>;

export async function extractMedicationDetails(
  input: ExtractMedicationDetailsInput
): Promise<ExtractMedicationDetailsOutput> {
  return extractMedicationDetailsFlow(input);
}

const extractMedicationDetailsPrompt = ai.definePrompt({
  name: 'extractMedicationDetailsPrompt',
  input: {schema: ExtractMedicationDetailsInputSchema},
  output: {schema: ExtractMedicationDetailsOutputSchema},
  prompt: `You are an AI assistant that extracts medication details from a prescription image.

  Analyze the prescription image and extract the following information for all medications present:
  - Medication Name: The name of the prescribed medication.
  - Dosage: The prescribed dosage of the medication.
  - Schedule: The schedule for taking the medication (e.g., once daily, twice daily, etc.).

  Prescription Image: {{media url=prescriptionImage}}

  Provide the extracted information in the following JSON format, ensuring all medications are included in the 'medications' array.`,
});

const extractMedicationDetailsFlow = ai.defineFlow(
  {
    name: 'extractMedicationDetailsFlow',
    inputSchema: ExtractMedicationDetailsInputSchema,
    outputSchema: ExtractMedicationDetailsOutputSchema,
  },
  async input => {
    const {output} = await extractMedicationDetailsPrompt(input);
    return output!;
  }
);
