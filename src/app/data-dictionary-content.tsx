"use client";

import type { DataDictionaryEntry } from '@/types';
import React, { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import Image from 'next/image';

const mockData: DataDictionaryEntry[] = [
  {
    id: '1',
    fieldName: 'userId',
    description: 'Unique identifier for the user.',
    dataType: 'string',
    sensitivity: 'Medium',
    maskingRecommendation: 'Tokenization',
    apiGroup: 'User API',
    tags: ['PII', 'Identifier'],
    example: 'u-123xyz',
    alternativeNames: ['user_id', 'identifier_user'],
    validationRules: 'UUID format',
    complianceNotes: 'GDPR Article 6',
    lastUpdated: '2023-10-26',
  },
  {
    id: '2',
    fieldName: 'transactionAmount',
    description: 'The monetary value of the transaction.',
    dataType: 'number',
    sensitivity: 'High',
    maskingRecommendation: 'Encryption (AES-256)',
    apiGroup: 'Billing API',
    tags: ['Financial'],
    example: '100.50',
    validationRules: 'Positive decimal, 2 decimal places',
    lastUpdated: '2023-11-15',
  },
  {
    id: '3',
    fieldName: 'isActive',
    description: 'Indicates if the user account is active.',
    dataType: 'boolean',
    sensitivity: 'Low',
    maskingRecommendation: 'None',
    apiGroup: 'User API',
    tags: ['Status'],
    example: 'true',
    lastUpdated: '2023-09-01',
  },
  {
    id: '4',
    fieldName: 'orderDate',
    description: 'The date when the order was placed.',
    dataType: 'date',
    sensitivity: 'Low',
    maskingRecommendation: 'Date Truncation (Month/Year)',
    apiGroup: 'Order API',
    tags: ['Timestamp', 'Order'],
    example: '2024-01-15',
    complianceNotes: 'Retain for 7 years',
    lastUpdated: '2024-01-20',
  },
  {
    id: '5',
    fieldName: 'productDetails',
    description: 'A complex object containing product information.',
    dataType: 'object',
    sensitivity: 'Medium',
    maskingRecommendation: 'Field-level masking for sensitive sub-fields',
    apiGroup: 'Product API',
    tags: ['Details'],
    example: '{\n  "name": "Awesome Widget",\n  "price": 29.99,\n  "sku": "AW-001"\n}',
    lastUpdated: '2024-02-10',
  },
];

const getBadgeVariant = (sensitivity: DataDictionaryEntry['sensitivity']): "default" | "secondary" | "destructive" | "outline" => {
  switch (sensitivity) {
    case 'Critical': return 'destructive';
    case 'High': return 'destructive';
    case 'Medium': return 'default'; // default is primary-based
    case 'Low': return 'secondary';
    default: return 'outline';
  }
};


export function DataDictionaryPageContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<DataDictionaryEntry[]>(mockData); // In a real app, this would come from a store/API

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      (entry) =>
        entry.fieldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.apiGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [searchTerm, data]);

  const handleExport = () => {
    // Placeholder for actual export logic
    const jsonData = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data_dictionary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (data.length === 0) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Your Data Dictionary is Empty</CardTitle>
          <CardDescription className="text-center">
            Start by importing your API specifications or adding entries manually.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Image src="https://placehold.co/300x200.png" alt="Empty data dictionary" width={300} height={200} data-ai-hint="empty data" className="rounded-md" />
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Entry
          </Button>
          <p className="text-sm text-muted-foreground">or import data from the Import/Export section.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="flex flex-col h-full gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline">Data Dictionary</CardTitle>
              <CardDescription>Search and manage your API fields and definitions.</CardDescription>
            </div>
            <div className="flex gap-2">
               <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New
              </Button>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Input
            type="search"
            placeholder="Search fields, descriptions, API groups, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4"
          />
        </CardContent>
      </Card>

      <Card className="flex-grow">
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
            <Table>
              <TableCaption className="py-4">A list of your API fields.</TableCaption>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="w-[150px]">Field Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Data Type</TableHead>
                  <TableHead className="w-[100px]">Sensitivity</TableHead>
                  <TableHead>Masking</TableHead>
                  <TableHead className="w-[120px]">API Group</TableHead>
                  <TableHead className="w-[150px]">Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? filteredData.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium font-code">{entry.fieldName}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{entry.dataType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(entry.sensitivity)} className="capitalize">{entry.sensitivity}</Badge>
                    </TableCell>
                    <TableCell>{entry.maskingRecommendation}</TableCell>
                    <TableCell>{entry.apiGroup}</TableCell>
                    <TableCell className="font-code text-xs">
                      {entry.example && entry.example.length > 20 ? `${entry.example.substring(0,20)}...` : entry.example}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found for "{searchTerm}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
