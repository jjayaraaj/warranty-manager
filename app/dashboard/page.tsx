'use client'

import { Bell, CheckCircle, Clock, CreditCard, LayoutGrid, List, PlusCircle, Search, XCircle } from "lucide-react";
import React, { useState } from "react";
import {
  Warranty,
  ViewMode,
  TabType,
  StatusCardProps,
  WarrantyCardProps,
  WarrantyListItemProps,
  ViewToggleProps,
  TabProps,
  getWarrantyStatus,
  MainTabType
} from '@/types/ui/warranty';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddWarrantyDialog from "./_components/AddWarranty";
import { WarrantyFormValues } from "@/types/ui/warranty-form";
import { toast } from "@/hooks/use-toast";
import WarrantyNotifications from "./_components/WarrantyNotifications";
import SubscriptionCard from "./_components/SubscriptionCard";
import { subscriptionFormSchema, SubscriptionFormValues } from "@/types/ui/subscriptionFormSchema";
import AddSubscriptionDialog from "./_components/AddSubscriptionDialog";
import { z } from "zod";
import { Subscription } from "@/types/ui/subscription";





 const mockWarranties: Warranty[] = [
  {
    id: 1,
    productName: "MacBook Pro",
    brand: "Apple",
    purchaseDate: "2024-01-15",
    expiryDate: "2025-01-15",
    daysLeft: 365,
    status: getWarrantyStatus(365)
  },
  {
    id: 2,
    productName: "Galaxy S24",
    brand: "Samsung",
    purchaseDate: "2023-12-01",
    expiryDate: "2024-12-01",
    daysLeft: 300,
    status: getWarrantyStatus(300)
  },
  {
    id: 3,
    productName: "PlayStation 5",
    brand: "Sony",
    purchaseDate: "2023-06-15",
    expiryDate: "2024-06-15",
    daysLeft: 30,
    status: getWarrantyStatus(30)
  },
  {
    id: 4,
    productName: "iPad Air",
    brand: "Apple",
    purchaseDate: "2023-08-20",
    expiryDate: "2024-08-20",
    daysLeft: -10,
    status: getWarrantyStatus(-10)
  }
];

// Status Card Component
const StatusCard: React.FC<StatusCardProps> = ({ title, count, icon, bgColor, iconColor }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className={`h-12 w-12 ${bgColor} rounded-full flex items-center justify-center`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// View Toggle Component
const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => (
  <div className="flex items-center space-x-2">
    <Button
      variant={currentView === 'grid' ? 'default' : 'ghost'}
      size="icon"
      onClick={() => onViewChange('grid')}
    >
      <LayoutGrid className="h-5 w-5" />
    </Button>
    <Button
      variant={currentView === 'list' ? 'default' : 'ghost'}
      size="icon"
      onClick={() => onViewChange('list')}
    >
      <List className="h-5 w-5" />
    </Button>
  </div>
);

// Warranty Card Component
const WarrantyCard: React.FC<WarrantyCardProps> = ({ warranty, onViewDetails }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
        <img 
          src="/api/placeholder/200/200" 
          alt={warranty.productName}
          className="max-h-full w-auto object-contain"
        />
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{warranty.productName}</h3>
          <p className="text-sm text-muted-foreground">{warranty.brand}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Purchase Date:</span>
            <span>{warranty.purchaseDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expiry Date:</span>
            <span>{warranty.expiryDate}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Days Left:</span>
            <Badge variant={warranty.daysLeft <= 30 ? 'destructive' : 'default'}>
              {warranty.daysLeft} days
            </Badge>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button 
        variant="secondary" 
        className="w-full"
        onClick={() => onViewDetails(warranty.id)}
      >
        View Details
      </Button>
    </CardFooter>
  </Card>
);

// Warranty List Item Component
const WarrantyListItem: React.FC<WarrantyListItemProps> = ({ warranty, onViewDetails }) => (
  <div className="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-accent/50 transition-colors">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 bg-muted rounded-lg"></div>
      <div>
        <h3 className="font-medium">{warranty.productName}</h3>
        <p className="text-sm text-muted-foreground">{warranty.brand}</p>
      </div>
    </div>
    <div className="flex items-center space-x-8">
      <div>
        <p className="text-sm text-muted-foreground">Purchase Date</p>
        <p className="font-medium">{warranty.purchaseDate}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Expiry Date</p>
        <p className="font-medium">{warranty.expiryDate}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Days Left</p>
        <Badge variant={warranty.daysLeft <= 30 ? 'destructive' : 'default'}>
          {warranty.daysLeft} days
        </Badge>
      </div>
      <Button 
        variant="ghost"
        onClick={() => onViewDetails(warranty.id)}
      >
        View Details
      </Button>
    </div>
  </div>
);

const defaultSubscriptionValues = {
  usageTracking: {
    enabled: false,
    currentUsage: 0,
    usageHistory: [],
    monthlyLimit: undefined,
    usageUnit: undefined
  },
  notifications: {
    paymentReminders: true,
    usageAlerts: true,
    priceChanges: true,
    reminderDays: [7, 3, 1]
  },
  notes: "",
  customBillingDays: undefined
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [warranties, setWarranties] = useState(mockWarranties);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 1,
      serviceName: "Netflix",
      provider: "Netflix, Inc.",
      planName: "Premium",
      subscriptionCost: 19.99,
      billingCycle: "monthly",
      startDate: "2024-01-01",
      autoRenewal: true,
      category: "streaming",
      paymentMethod: "Credit Card",
      notes: "",
      usageTracking: {
        enabled: true,
        monthlyLimit: 100,
        currentUsage: 85,
        usageUnit: "hours",
        usageHistory: []
      },
      notifications: {
        paymentReminders: true,
        usageAlerts: true,
        priceChanges: true,
        reminderDays: [7, 3, 1]
      }
    }
  ]);
  const [mainActiveTab, setMainActiveTab] = useState<MainTabType>('warranties');
 



  // Calculate counts for status cards
  const totalWarranties = warranties.length;
  const activeWarranties = warranties.filter(w => w.status === 'active').length;
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const expiringWarranties = warranties.filter(w => w.status === 'expiring').length;
  const expiredWarranties = warranties.filter(w => w.status === 'expired').length;

  const handleViewDetails = (id: number): void => {
    console.log(`View details for warranty ${id}`);
  };

  const handleAddWarranty = (formData: WarrantyFormValues) => {
    // Calculate expiry date based on purchase date and warranty period
    const purchaseDate = new Date(formData.purchaseDate);
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(expiryDate.getMonth() + formData.warrantyPeriod);
    
    // Calculate days left
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create new warranty object
    const newWarranty: Warranty = {
      id: warranties.length + 1, // In a real app, this would come from the backend
      productName: formData.productName,
      brand: formData.brand,
      purchaseDate: formData.purchaseDate,
      expiryDate: expiryDate.toISOString(),
      status: getWarrantyStatus(daysLeft),
      daysLeft: daysLeft,
      serialNumber: formData.serialNumber,
      modelNumber: formData.modelNumber,
      retailer: formData.retailerName,
      price: formData.purchasePrice
    };

    // Add new warranty to state
    setWarranties(prev => [...prev, newWarranty]);

    // Show success message
    toast({
      title: "Warranty Added",
      description: `${formData.productName} warranty has been successfully added.`,
    });
  };

   // Add subscription metrics
   const totalSubscriptions = subscriptions.length;
   const monthlySubscriptionCost = subscriptions.reduce(
     (total, sub) => total + sub.subscriptionCost,
     0
   );


   // Add this within the Page component:
   const handleAddSubscription = (formData: Partial<SubscriptionFormValues>) => {
      // Ensure all required fields are present from the form data
      console.log("ASDasdgh")
  if (!formData.serviceName || !formData.provider || !formData.billingCycle || 
    !formData.startDate || !formData.category || !formData.paymentMethod) {
  toast({
    title: "Error",
    description: "Missing required fields",
    variant: "destructive"
  });
  return;
}

const newSubscription: Subscription = {
  id: subscriptions.length + 1,
  serviceName: formData.serviceName,
  provider: formData.provider,
  planName: formData.planName ?? '',
  subscriptionCost: formData.subscriptionCost ?? 0,
  billingCycle: formData.billingCycle,
  startDate: formData.startDate,
  autoRenewal: formData.autoRenewal ?? false,
  category: formData.category,
  paymentMethod: formData.paymentMethod,
  // Merge optional fields with defaults
  notes: formData.notes || defaultSubscriptionValues.notes,
  customBillingDays: formData.customBillingDays,
  usageTracking: {
    ...defaultSubscriptionValues.usageTracking,
    ...formData.usageTracking
  },
  notifications: {
    ...defaultSubscriptionValues.notifications,
    ...formData.notifications
  }
};

setSubscriptions(prev => [...prev, newSubscription]);
  
    
  
    toast({
      title: "Subscription Added",
      description: `${formData.serviceName} subscription has been successfully added.`,
    });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {/* <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Warranty Manager</h1>
            <div className="flex items-center space-x-4">
              
              <div className="flex items-center space-x-4">
  <WarrantyNotifications />
  <div className="h-8 w-8 rounded-full bg-gray-200"></div>
</div>

              <Button variant="ghost" size="icon">
                <div className="h-8 w-8 rounded-full bg-muted"/>
              </Button>
            </div>
          </div>
        </div>
      </header> */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search warranties..."
                className="pl-9 w-[280px]"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="samsung">Samsung</SelectItem>
                <SelectItem value="sony">Sony</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <AddWarrantyDialog onSubmit={handleAddWarranty} />
            <AddSubscriptionDialog onSubmit={handleAddSubscription} />
          
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatusCard
            title="Total Warranties"
            count={totalWarranties}
            icon={<CheckCircle className="h-6 w-6" />}
            bgColor="bg-blue-100"
            iconColor="text-blue-500"
          />
          <StatusCard
            title="Active Warranties"
            count={activeWarranties}
            icon={<Clock className="h-6 w-6" />}
            bgColor="bg-green-100"
            iconColor="text-green-500"
          />
          <StatusCard
            title="Expired Warranties"
            count={expiredWarranties}
            icon={<XCircle className="h-6 w-6" />}
            bgColor="bg-red-100"
            iconColor="text-red-500"
          />
          <StatusCard
            title="Total Subscriptions"
            count={totalSubscriptions}
            icon={<CreditCard className="h-6 w-6" />}
            bgColor="bg-purple-100"
            iconColor="text-purple-500"
          />
          <StatusCard
            title="Monthly Cost"
            // count={`$${monthlySubscriptionCost.toFixed(2)}`}
            count={monthlySubscriptionCost}
            icon={<Clock className="h-6 w-6" />}
            bgColor="bg-orange-100"
            iconColor="text-orange-500"
          />
        </div>

        <Tabs defaultValue="warranties" className="mb-6" onValueChange={(value) => setMainActiveTab(value as MainTabType)}>
          <TabsList>
            <TabsTrigger value="warranties">Warranties</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>
        </Tabs>

      

         {/* Warranty Content */}
         {mainActiveTab === 'warranties' && 
         <>
           {/* Tabs */}
        <Tabs defaultValue={activeTab} className="mb-6" onValueChange={(value) => setActiveTab(value as TabType)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expiring">Expiring</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>

         {/* Warranty Display */}
         {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warranties.map(warranty => (
              <WarrantyCard
                key={warranty.id}
                warranty={warranty}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card>
            {warranties.map(warranty => (
              <WarrantyListItem
                key={warranty.id}
                warranty={warranty}
                onViewDetails={handleViewDetails}
              />
            ))}
          </Card>
        )}
         </>
}
         {/* Subscription Content */}
        {mainActiveTab === 'subscriptions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription, index) => (
              <SubscriptionCard
                key={index}
                subscription={subscription}
              />
            ))}
          </div>
        )}
         
         

       
      </main>
    </div>
  );
}