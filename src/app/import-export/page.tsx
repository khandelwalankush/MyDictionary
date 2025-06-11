"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, DownloadCloud, FileJson, FileText, FileSpreadsheet, ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function ImportExportPage() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImportFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!importFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import.",
        variant: "destructive",
      });
      return;
    }
    // Placeholder for actual import logic
    toast({
      title: "Import Started (Mock)",
      description: `Simulating import of ${importFile.name}. This feature is a placeholder.`,
    });
    console.log("Importing file:", importFile);
    // Reset file input after mock import
    setImportFile(null);
    const fileInput = document.getElementById('importFile') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleExport = (format: 'json' | 'html' | 'swagger') => {
    // Placeholder for actual export logic
    toast({
      title: "Export Started (Mock)",
      description: `Simulating export in ${format.toUpperCase()} format. This feature is a placeholder.`,
    });
    console.log("Exporting data as:", format);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><ArrowRightLeft className="mr-2 h-6 w-6 text-accent" /> Import / Export Data</CardTitle>
          <CardDescription>
            Manage your data dictionary by importing existing specifications or exporting for documentation.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Import Data Dictionary</CardTitle>
              <CardDescription>
                Upload API documentation (Swagger, JSON) or historical data dictionaries (Excel, JSON) to seed the system.
                <br />
                <small className="text-muted-foreground">(Note: Actual file parsing is a placeholder.)</small>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="importFile">Select File</Label>
                <Input id="importFile" type="file" onChange={handleFileChange} accept=".json,.yaml,.yml,.xlsx,.csv" />
                {importFile && <p className="text-sm text-muted-foreground">Selected: {importFile.name}</p>}
              </div>
               <Image src="https://placehold.co/400x250.png" alt="Import data visual" width={400} height={250} className="w-full max-w-md mx-auto rounded-md my-4" data-ai-hint="data import" />
            </CardContent>
            <CardFooter>
              <Button onClick={handleImport} disabled={!importFile}>
                <UploadCloud className="mr-2 h-4 w-4" /> Import Selected File
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Export Data Dictionary</CardTitle>
              <CardDescription>
                Export the standardized data dictionary in various formats.
                <br />
                <small className="text-muted-foreground">(Note: Actual file generation is a placeholder.)</small>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Choose a format to export your data dictionary:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full" onClick={() => handleExport('json')}>
                  <FileJson className="mr-2 h-5 w-5 text-primary" /> Export as JSON
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleExport('html')}>
                  <FileText className="mr-2 h-5 w-5 text-primary" /> Export as HTML
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleExport('swagger')}>
                  <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" /> Export as Swagger (OpenAPI)
                </Button>
              </div>
               <Image src="https://placehold.co/400x250.png" alt="Export data visual" width={400} height={250} className="w-full max-w-md mx-auto rounded-md my-4" data-ai-hint="data export" />
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Export functionality will generate files based on the current data dictionary.</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
