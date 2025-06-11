"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LexiFieldLogo } from '@/components/icons/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Wand2,
  FileSignature,
  ShieldCheck,
  ListFilter,
  ArrowRightLeft,
  Settings,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Data Dictionary', icon: BookOpen, exact: true },
  { href: '/field-name-suggestion', label: 'Name Suggestion', icon: Wand2 },
  { href: '/description-generation', label: 'Description Generation', icon: FileSignature },
  { href: '/field-validation', label: 'Field Validation', icon: ShieldCheck },
  { href: '/masking-recommendations', label: 'Masking Rules', icon: ListFilter },
  { href: '/import-export', label: 'Import / Export', icon: ArrowRightLeft },
];

const pageTitles: Record<string, string> = {
  '/': 'Data Dictionary',
  '/field-name-suggestion': 'AI Field Name Suggestion',
  '/description-generation': 'AI Description Generation',
  '/field-validation': 'Field Validation Engine',
  '/masking-recommendations': 'Smart Masking Recommendations',
  '/import-export': 'Import / Export Data',
  '/settings': 'Application Settings',
};

function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // useSidebar hook is now correctly called within a component wrapped by SidebarProvider
  // const { isMobile, setOpenMobile } = useSidebar(); // Not directly used here, but SidebarTrigger and Sidebar use it.

  const currentPageTitle = pageTitles[pathname] || 'LexiField';

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
      <Sidebar
        className="hidden border-r bg-sidebar text-sidebar-foreground md:block"
        variant="sidebar"
        collapsible="icon"
      >
        <SidebarHeader className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
            <LexiFieldLogo className="h-7 w-7" />
            <span className="font-headline text-xl">LexiField</span>
          </Link>
        </SidebarHeader>
        <Separator className="bg-sidebar-border" />
        <SidebarContent className="flex-1">
          <ScrollArea className="h-full">
            <SidebarMenu className="p-4">
              {navItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        className={cn(
                          "w-full justify-start",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        isActive={isActive}
                        tooltip={{ content: item.label, side: 'right', className: "bg-primary text-primary-foreground" }}
                      >
                        <item.icon className="mr-3 h-5 w-5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <Separator className="bg-sidebar-border" />
        <SidebarFooter className="p-4">
          <Link href="/settings" legacyBehavior passHref>
             <SidebarMenuButton className="w-full justify-start" tooltip={{ content: "Settings", side: 'right', className: "bg-primary text-primary-foreground" }}>
                <Settings className="mr-3 h-5 w-5 shrink-0" />
                <span className="truncate">Settings</span>
              </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden shrink-0" asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SidebarTrigger>
           <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <h1 className="flex-1 text-xl font-headline font-semibold">{currentPageTitle}</h1>
              {/* Future user menu / actions can go here */}
           </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:gap-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    // SidebarProvider now manages its own state regarding mobile/desktop open status.
    // Its internal `useIsMobile` and `defaultOpen` prop (which defaults to true)
    // handle the initial state correctly.
    <SidebarProvider>
      <AppShellLayout>{children}</AppShellLayout>
    </SidebarProvider>
  );
}
