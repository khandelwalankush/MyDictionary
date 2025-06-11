"use client";

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldCheck, CheckCircle, XCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { suggestFieldName } from '@/ai/flows/suggest-field-name'; // Re-using for mock validation
import Image from 'next/image';
import { cn } from "@/lib/utils"; // Added import for cn

type ValidationStatus = "success" | "warning" | "error" | "info";

interface ValidationResult {
  status: ValidationStatus;
  message: string;
  details?: string[];
  suggestedAlternative?: string;
}

const mockNamingConventions = {
  case: /^[a-z]+(?:[A-Z][a-z]*)*$/, // camelCase
  maxLength: 30,
  reservedWords: ['id', 'type', 'object'], // Simplified
};

export default function FieldValidationPage() {
  const [fieldName, setFieldName] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const performLocalValidation = (name: string): Partial<ValidationResult> => {
    const messages: string[] = [];
    let status: ValidationStatus = "success";

    if (!mockNamingConventions.case.test(name)) {
      messages.push("Field name does not follow camelCase convention.");
      status = "warning";
    }
    if (name.length > mockNamingConventions.maxLength) {
      messages.push(`Field name exceeds maximum length of ${mockNamingConventions.maxLength} characters.`);
      status = "warning";
    }
    if (mockNamingConventions.reservedWords.includes(name.toLowerCase())) {
      messages.push(`Field name '${name}' is a reserved word.`);
      status = "error";
    }
    if (messages.length > 0 && status === "success") status = "warning";
    
    return { status, details: messages.length > 0 ? messages : undefined };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setValidationResult(null);

    startTransition(async () => {
      try {
        const localValidation = performLocalValidation(fieldName);
        let finalStatus = localValidation.status || "info";
        let finalMessage = "Validation checks performed.";
        let finalDetails = localValidation.details || [];
        let suggestedAlternative: string | undefined;

        // Mock AI cross-referencing
        // This is a simplified check. A real system would query a data dictionary.
        // Here, we'll use the suggestFieldName flow to see if it offers alternatives or flags issues.
        const aiCheckInput = {
          description: `A field named '${fieldName}'. Check for potential conflicts or suggest improvements.`,
          existingFieldNames: ['orderId', 'customerName', 'productSku'], // Mock existing fields
        };
        const aiSuggestion = await suggestFieldName(aiCheckInput);

        if (aiSuggestion.suggestedFieldName.toLowerCase() !== fieldName.toLowerCase() && !fieldName.includes(aiSuggestion.suggestedFieldName) && !aiSuggestion.suggestedFieldName.includes(fieldName)) {
           suggestedAlternative = aiSuggestion.suggestedFieldName;
           finalDetails.push(`AI Suggestion: Consider '${aiSuggestion.suggestedFieldName}'. Reasoning: ${aiSuggestion.reasoning}`);
           if(finalStatus !== "error") finalStatus = "warning";
        } else if (aiSuggestion.reasoning.toLowerCase().includes("conflict") || aiSuggestion.reasoning.toLowerCase().includes("ambiguous")) {
            finalDetails.push(`AI Concern: ${aiSuggestion.reasoning}`);
            if(finalStatus !== "error") finalStatus = "warning";
        }


        if (finalStatus === "success" && finalDetails.length === 0) {
          finalMessage = `Field name '${fieldName}' passes all checks.`;
        } else if (finalStatus === "error") {
          finalMessage = `Field name '${fieldName}' has critical issues.`;
        } else if (finalStatus === "warning") {
           finalMessage = `Field name '${fieldName}' has some warnings.`;
        }


        setValidationResult({ status: finalStatus, message: finalMessage, details: finalDetails, suggestedAlternative });
        toast({
          title: "Validation Complete",
          description: finalMessage,
        });

      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          title: "Error During Validation",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };
  
  const getResultIcon = (status: ValidationStatus) => {
    switch(status) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <Info className="h-5 w-5 text-yellow-500" />; // Lucide Info is often used for warnings
      case "error": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-2">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-accent" /> Field Name Validation Engine</CardTitle>
            <CardDescription>
              Validate your proposed field names against naming conventions and check for potential conflicts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Proposed Field Name</Label>
              <Input
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g., newCustomer_email"
                required
                className="font-code"
              />
              <p className="text-xs text-muted-foreground">
                Current convention (mock): camelCase, max 30 chars, not 'id', 'type', 'object'.
              </p>
            </div>
            {/* Add more inputs for context if needed, e.g., API Group, Description */}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              Validate Field Name
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="lg:col-span-1 space-y-6">
        {validationResult && (
          <Card className={
            validationResult.status === "success" ? "bg-green-500/10 border-green-500" :
            validationResult.status === "warning" ? "bg-yellow-500/10 border-yellow-500" :
            validationResult.status === "error" ? "bg-red-500/10 border-red-500" :
            "bg-blue-500/10 border-blue-500"
          }>
            <CardHeader>
              <CardTitle className={cn("font-headline flex items-center", 
                validationResult.status === "success" ? "text-green-600" :
                validationResult.status === "warning" ? "text-yellow-600" :
                validationResult.status === "error" ? "text-red-600" :
                "text-blue-600"
              )}>
                {getResultIcon(validationResult.status)}
                <span className="ml-2">Validation Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{validationResult.message}</p>
              {validationResult.details && validationResult.details.length > 0 && (
                <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                  {validationResult.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
              {validationResult.suggestedAlternative && (
                <p className="text-sm mt-2">
                  Alternative suggestion: <strong className="font-code">{validationResult.suggestedAlternative}</strong>
                </p>
              )}
            </CardContent>
          </Card>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!validationResult && !error && !isPending && (
           <Card className="border-dashed border-gray-300">
            <CardContent className="p-6 text-center">
               <Image src="https://placehold.co/300x200.png" alt="Validation placeholder" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="validation check" />
              <p className="text-muted-foreground">
                Enter a field name to check its validity and consistency.
              </p>
            </CardContent>
          </Card>
        )}
         {isPending && (
           <Card>
            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Validating field name...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
