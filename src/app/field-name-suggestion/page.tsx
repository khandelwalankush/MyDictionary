"use client";

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { suggestFieldName, SuggestFieldNameInput, SuggestFieldNameOutput } from '@/ai/flows/suggest-field-name';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function FieldNameSuggestionPage() {
  const [description, setDescription] = useState('');
  const [existingFieldNames, setExistingFieldNames] = useState('');
  const [frameworkRequirements, setFrameworkRequirements] = useState('');
  const [result, setResult] = useState<SuggestFieldNameOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const input: SuggestFieldNameInput = {
          description,
          existingFieldNames: existingFieldNames.split(',').map(name => name.trim()).filter(name => name),
          frameworkRequirements: frameworkRequirements || undefined,
        };
        const output = await suggestFieldName(input);
        setResult(output);
        toast({
          title: "Suggestion Generated!",
          description: "A field name has been successfully suggested.",
        });
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          title: "Error Generating Suggestion",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-2">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Wand2 className="mr-2 h-6 w-6 text-accent" /> AI Field Name Suggestion</CardTitle>
            <CardDescription>
              Get AI-powered suggestions for API field names based on your description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Field Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., The unique identifier for a customer's billing account"
                required
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingFieldNames">Existing Field Names (comma-separated, optional)</Label>
              <Input
                id="existingFieldNames"
                value={existingFieldNames}
                onChange={(e) => setExistingFieldNames(e.target.value)}
                placeholder="e.g., customerId, accountBalance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frameworkRequirements">Framework/Industry Requirements (optional)</Label>
              <Textarea
                id="frameworkRequirements"
                value={frameworkRequirements}
                onChange={(e) => setFrameworkRequirements(e.target.value)}
                placeholder="e.g., Must be camelCase, max 30 characters, adhere to FHIR standards"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Suggest Field Name
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="lg:col-span-1 space-y-6">
        {result && (
          <Card className="bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="font-headline text-accent flex items-center"><Sparkles className="mr-2 h-5 w-5" /> Suggested Name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Suggested Field Name:</Label>
                <p className="font-code text-lg p-2 bg-background rounded-md">
                  {result.suggestedFieldName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-semibold">Reasoning:</Label>
                <p className="text-sm p-2 bg-background rounded-md whitespace-pre-wrap">
                  {result.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!result && !error && !isPending && (
          <Card className="border-dashed border-gray-300">
            <CardContent className="p-6 text-center">
                <Image src="https://placehold.co/300x200.png" alt="AI suggestion placeholder" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="ai idea" />
              <p className="text-muted-foreground">
                Fill in the details and let our AI suggest the perfect field name for you.
              </p>
            </CardContent>
          </Card>
        )}
         {isPending && (
           <Card>
            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Generating suggestion...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
