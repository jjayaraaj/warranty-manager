'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Define the route mapping for better readability and maintenance
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  warranties: 'Warranty Library',
  'add-warranty': 'Add Warranty',
  settings: 'Settings',
  notifications: 'Notifications',
  details: 'Warranty Details',
};

const Header = () => {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = () => {
    // Remove leading slash and split path into segments
    const segments = pathname.split('/').filter(segment => segment);
    
    // Always start with dashboard as home
    const breadcrumbs = [{
      href: '/dashboard',
      label: 'Dashboard',
      current: segments.length === 1 && segments[0] === 'dashboard'
    }];

    // Build up the breadcrumb path
    let currentPath = '';
    segments.forEach((segment, index) => {
      if (segment === 'dashboard') return; // Skip dashboard as it's already added
      
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Handle dynamic routes (e.g., warranty details with IDs)
      const label = segment.match(/^[0-9a-fA-F-]+$/) 
        ? 'Warranty Details' 
        : (routeLabels[segment] || segment.replace(/-/g, ' '));

      breadcrumbs.push({
        href: isLast ? '' : currentPath,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.label}>
                <BreadcrumbItem className="hidden md:block">
                  {crumb.current ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;