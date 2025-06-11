'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating descriptions for API fields.
 *
 * - generateFieldDescription - A function that generates descriptions for API fields ensuring clarity,
 *   conciseness, and compliance with industry and regulatory standards.
 * - GenerateFieldDescriptionInput - The input type for the generateFieldDescription function.
 * - GenerateFieldDescriptionOutput - The return type for the generateFieldDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFieldDescriptionInputSchema = z.object({
  fieldName: z.string().describe('The name of the API field.'),
  fieldDetails: z.string().describe('Details about the API field, including its purpose and data type.'),
  regulatoryRequirements: z
    .string()
    .optional()
    .describe('Any regulatory requirements that the field must adhere to.'),
  frameworkRequirements: z
    .string()
    .optional()
    .describe('Any framework requirements that the field must adhere to.'),
});

export type GenerateFieldDescriptionInput = z.infer<typeof GenerateFieldDescriptionInputSchema>;

const GenerateFieldDescriptionOutputSchema = z.object({
  fieldDescription: z.string().describe('A clear, concise, and compliant description for the API field.'),
});

export type GenerateFieldDescriptionOutput = z.infer<typeof GenerateFieldDescriptionOutputSchema>;

export async function generateFieldDescription(
  input: GenerateFieldDescriptionInput
): Promise<GenerateFieldDescriptionOutput> {
  return generateFieldDescriptionFlow(input);
}

const generateFieldDescriptionPrompt = ai.definePrompt({
  name: 'generateFieldDescriptionPrompt',
  input: {schema: GenerateFieldDescriptionInputSchema},
  output: {schema: GenerateFieldDescriptionOutputSchema},
  prompt: `You are an expert compliance officer responsible for generating descriptions for API fields.

  Your goal is to create descriptions that are clear, concise, and compliant with industry and regulatory standards, as well as any specific framework requirements.

  Here are the details of the field:
  Field Name: {{{fieldName}}}
  Field Details: {{{fieldDetails}}}
  {{#if regulatoryRequirements}}
  Regulatory Requirements: {{{regulatoryRequirements}}}
  {{/if}}
  {{#if frameworkRequirements}}
  Framework Requirements: {{{frameworkRequirements}}}
  {{/if}}

  Generate a description for the field that meets these requirements:
  `,
});

const generateFieldDescriptionFlow = ai.defineFlow(
  {
    name: 'generateFieldDescriptionFlow',
    inputSchema: GenerateFieldDescriptionInputSchema,
    outputSchema: GenerateFieldDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateFieldDescriptionPrompt(input);
    return output!;
  }
);
