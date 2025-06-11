"use client";

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileSignature, Sparkles } from 'lucide-react';
import { generateFieldDescription, GenerateFieldDescriptionInput, GenerateFieldDescriptionOutput } from '@/ai/flows/generate-field-description';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function DescriptionGenerationPage() {
  const [fieldName, setFieldName] = useState('');
  const [fieldDetails, setFieldDetails] = useState('');
  const [regulatoryRequirements, setRegulatoryRequirements] = useState('');
  const [frameworkRequirements, setFrameworkRequirements] = useState('');
  const [result, setResult] = useState<GenerateFieldDescriptionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const input: GenerateFieldDescriptionInput = {
          fieldName,
          fieldDetails,
          regulatoryRequirements: regulatoryRequirements || undefined,
          frameworkRequirements: frameworkRequirements || undefined,
        };
        const output = await generateFieldDescription(input);
        setResult(output);
        toast({
          title: "Description Generated!",
          description: "An API field description has been successfully generated.",
        });
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          title: "Error Generating Description",
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
            <CardTitle className="font-headline flex items-center"><FileSignature className="mr-2 h-6 w-6 text-accent" /> AI Field Description Generation</CardTitle>
            <CardDescription>
              Generate clear, concise, and compliant descriptions for your API fields using AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g., customerBillingId"
                required
                className="font-code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldDetails">Field Details (Purpose, Data Type, etc.)</Label>
              <Textarea
                id="fieldDetails"
                value={fieldDetails}
                onChange={(e) => setFieldDetails(e.target.value)}
                placeholder="e.g., String (UUID). Unique identifier for the customer's billing account. Used for linking payments and invoices."
                required
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regulatoryRequirements">Regulatory Requirements (optional)</Label>
              <Textarea
                id="regulatoryRequirements"
                value={regulatoryRequirements}
                onChange={(e) => setRegulatoryRequirements(e.target.value)}
                placeholder="e.g., GDPR - data subject identifier, CCPA - personal information"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frameworkRequirements">Framework Requirements (optional)</Label>
              <Textarea
                id="frameworkRequirements"
                value={frameworkRequirements}
                onChange={(e) => setFrameworkRequirements(e.target.value)}
                placeholder="e.g., Adhere to OpenAPI v3 specification for descriptions. Max 200 characters."
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
              Generate Description
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="lg:col-span-1 space-y-6">
        {result && (
          <Card className="bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="font-headline text-accent flex items-center"><Sparkles className="mr-2 h-5 w-5" /> Generated Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-sm font-semibold">For Field: <span className="font-code">{fieldName}</span></Label>
              <p className="mt-1 text-sm p-3 bg-background rounded-md whitespace-pre-wrap">
                {result.fieldDescription}
              </p>
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
              <Image src="https://placehold.co/300x200.png" alt="AI description placeholder" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="ai writing" />
              <p className="text-muted-foreground">
                Provide field details and let AI craft the perfect description.
              </p>
            </CardContent>
          </Card>
        )}
        {isPending && (
           <Card>
            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Generating description...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
