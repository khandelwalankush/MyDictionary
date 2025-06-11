"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Settings className="mr-2 h-6 w-6 text-accent" /> Application Settings
          </CardTitle>
          <CardDescription>
            Manage your LexiField application preferences and configurations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <Image src="https://placehold.co/400x300.png" alt="Settings placeholder" width={400} height={300} className="rounded-md" data-ai-hint="settings cog" />
          <p className="text-lg text-muted-foreground">
            Settings page is under construction.
          </p>
          <p className="text-sm">
            Future options will include theme customization, API integration settings, user management, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
