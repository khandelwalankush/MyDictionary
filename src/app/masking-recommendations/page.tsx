"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ListFilter, Sparkles, ShieldAlert } from 'lucide-react';
import type { DataDictionaryEntry, MaskingTechnique } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const dataTypes: DataDictionaryEntry['dataType'][] = ['string', 'number', 'boolean', 'object', 'array', 'date', 'timestamp', 'mixed'];
const sensitivityLevels: DataDictionaryEntry['sensitivity'][] = ['None', 'Low', 'Medium', 'High', 'Critical'];

export default function MaskingRecommendationsPage() {
  const [fieldName, setFieldName] = useState('');
  const [dataType, setDataType] = useState<DataDictionaryEntry['dataType'] | undefined>(undefined);
  const [sensitivity, setSensitivity] = useState<DataDictionaryEntry['sensitivity'] | undefined>(undefined);
  const [regulatoryContext, setRegulatoryContext] = useState('');
  const [recommendation, setRecommendation] = useState<MaskingTechnique | null>(null);
  const { toast } = useToast();

  const getRecommendation = (): MaskingTechnique => {
    if (!dataType || !sensitivity) return "None";

    if (sensitivity === 'Critical') {
      if (dataType === 'string' || dataType === 'object') return "Tokenization";
      return "Encryption (AES-256)";
    }
    if (sensitivity === 'High') {
      if (dataType === 'string' && (fieldName.toLowerCase().includes('email') || fieldName.toLowerCase().includes('phone'))) return "Redaction";
      if (dataType === 'date' || dataType === 'timestamp') return "Date Truncation";
      return "Encryption (AES-256)";
    }
    if (sensitivity === 'Medium') {
      if (dataType === 'string' && (fieldName.toLowerCase().includes('address'))) return "Generalization";
      if (dataType === 'number' && (fieldName.toLowerCase().includes('salary') || fieldName.toLowerCase().includes('income'))) return "Hashing (SHA-256)"; // Or Generalization
      if (dataType === 'date') return "Date Truncation";
      return "Hashing (SHA-256)";
    }
    // Low or None sensitivity
    return "None";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dataType || !sensitivity) {
      toast({
        title: "Missing Information",
        description: "Please select data type and sensitivity level.",
        variant: "destructive",
      });
      return;
    }
    const rec = getRecommendation();
    setRecommendation(rec);
    toast({
      title: "Recommendation Generated",
      description: `Suggested masking: ${rec}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-2">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><ListFilter className="mr-2 h-6 w-6 text-accent" /> Smart Masking Recommendations</CardTitle>
            <CardDescription>
              Get recommendations for data masking techniques based on field characteristics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g., userEmailAddress"
                required
                className="font-code"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select value={dataType} onValueChange={(value) => setDataType(value as DataDictionaryEntry['dataType'])}>
                  <SelectTrigger id="dataType">
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes.map(dt => <SelectItem key={dt} value={dt} className="capitalize">{dt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensitivity">Sensitivity Level</Label>
                <Select value={sensitivity} onValueChange={(value) => setSensitivity(value as DataDictionaryEntry['sensitivity'])}>
                  <SelectTrigger id="sensitivity">
                    <SelectValue placeholder="Select sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensitivityLevels.map(sl => <SelectItem key={sl} value={sl} className="capitalize">{sl}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="regulatoryContext">Regulatory Context / Compliance Needs (optional)</Label>
              <Textarea
                id="regulatoryContext"
                value={regulatoryContext}
                onChange={(e) => setRegulatoryContext(e.target.value)}
                placeholder="e.g., GDPR, CCPA, PII data. Field contains Social Security Numbers."
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Recommendation
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="lg:col-span-1 space-y-6">
        {recommendation && (
          <Card className="bg-accent/10 border-accent">
            <CardHeader>
              <CardTitle className="font-headline text-accent flex items-center"><ShieldAlert className="mr-2 h-5 w-5" /> Masking Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>For field <strong className="font-code">{fieldName || "N/A"}</strong>:</p>
              <p className="text-lg font-semibold p-3 bg-background rounded-md">{recommendation}</p>
              <p className="text-xs text-muted-foreground">
                This is a simplified recommendation. Always consult your data governance policies and regulatory requirements.
              </p>
            </CardContent>
          </Card>
        )}
        {!recommendation && (
          <Card className="border-dashed border-gray-300">
            <CardContent className="p-6 text-center">
              <Image src="https://placehold.co/300x200.png" alt="Masking recommendation placeholder" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="data mask" />
              <p className="text-muted-foreground">
                Enter field details to receive a masking technique suggestion.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
