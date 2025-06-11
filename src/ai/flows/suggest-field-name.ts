'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting API field names based on a description.
 *
 * - suggestFieldName - A function that suggests API field names based on a provided description.
 * - SuggestFieldNameInput - The input type for the suggestFieldName function.
 * - SuggestFieldNameOutput - The return type for the suggestFieldName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFieldNameInputSchema = z.object({
  description: z
    .string()
    .describe('A description of the API field for which a name is needed.'),
  existingFieldNames: z
    .array(z.string())
    .optional()
    .describe('A list of existing field names to avoid conflicts or ensure consistency.'),
  frameworkRequirements: z
    .string()
    .optional()
    .describe('Specific framework requirements or industry standards to adhere to.'),
});
export type SuggestFieldNameInput = z.infer<typeof SuggestFieldNameInputSchema>;

const SuggestFieldNameOutputSchema = z.object({
  suggestedFieldName:
    z.string()
    .describe('The suggested API field name based on the description.'),
  reasoning:
    z.string()
    .describe('The reasoning behind the suggested field name.'),
});
export type SuggestFieldNameOutput = z.infer<typeof SuggestFieldNameOutputSchema>;

export async function suggestFieldName(input: SuggestFieldNameInput): Promise<SuggestFieldNameOutput> {
  return suggestFieldNameFlow(input);
}

const suggestFieldNamePrompt = ai.definePrompt({
  name: 'suggestFieldNamePrompt',
  input: {schema: SuggestFieldNameInputSchema},
  output: {schema: SuggestFieldNameOutputSchema},
  prompt: `You are an expert data architect specializing in API design and naming conventions.

  Your task is to suggest an API field name based on the provided description, while adhering to industry standards, best practices, and any specific framework requirements.

  Description: {{{description}}}

  {{#if existingFieldNames}}
  Existing Field Names: {{existingFieldNames}}
  Consider these existing field names to maintain consistency and avoid conflicts.
  {{/if}}

  {{#if frameworkRequirements}}
  Framework Requirements: {{{frameworkRequirements}}}
  Adhere to these framework requirements and industry standards when suggesting the field name.
  {{/if}}

  Provide a well-reasoned suggestion for the API field name and explain your reasoning.
  Make sure the name adheres to common naming conventions such as camelCase or snake_case.
  Ensure that the name is clear, concise, and meaningful.
  Validate field names against existing APIs and cross-reference for consistency. For example, discern the term meaning of start_date, invoice_date, invoice_start_date, and original_invoice_date.
  These field names can refer to the same term and definition as we need to check and validate them.
  `,
});

const suggestFieldNameFlow = ai.defineFlow(
  {
    name: 'suggestFieldNameFlow',
    inputSchema: SuggestFieldNameInputSchema,
    outputSchema: SuggestFieldNameOutputSchema,
  },
  async input => {
    const {output} = await suggestFieldNamePrompt(input);
    return output!;
  }
);
