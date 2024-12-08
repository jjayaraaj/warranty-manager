'use client'
import React from 'react';
import { Clock, Calendar, Receipt, Building, Phone, AlertCircle, ArrowLeft, Bell, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import EditWarrantyForm from './EditWarrantyForm';
import { useToast } from '@/hooks/use-toast';

const warrantyData = {
    productName: "MacBook Pro",
    brand: "Apple",
    modelNumber: "MBP2023",
    serialNumber: "FVFF1HNAA",
    purchaseDate: "2024-01-15",
    warrantyPeriod: 24,
    purchasePrice: 1299.99,
    retailerName: "Best Buy",
    retailerContact: "+1 (555) 123-4567",
    notes: "Extended warranty purchased with additional coverage for accidental damage.",
    receiptImage: "/api/placeholder/400/300",
    productImage: "/api/placeholder/400/300",
    warrantyDocImage: "/api/placeholder/400/300",
    notifications: {
      email: true,
      inApp: true,
      reminderDays: [30, 7, 1]
    },
    status: "active",
    history: [
      { date: "2024-01-15", event: "Warranty registered", type: "info" },
      { date: "2024-02-01", event: "Documentation verified", type: "success" },
      { date: "2024-03-15", event: "Reminder settings updated", type: "info" }
    ]
  };

const WarrantyDetails = ({ warrantyId }: { warrantyId: string }) => {
  // Mock data - in real app, fetch based on warrantyId
 const [warranty, setWarranty] = React.useState(warrantyData);
 const [isOpen, setIsOpen] = React.useState(false);
 const { toast } = useToast();

  const getExpirationDate = () => {
    const purchaseDate = new Date(warranty.purchaseDate);
    return new Date(purchaseDate.setMonth(purchaseDate.getMonth() + warranty.warrantyPeriod));
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const expirationDate = getExpirationDate();
    const diffTime = Math.abs(expirationDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'expiring':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleUpdateWarranty = async (data: typeof warrantyData) => {
    try {
      // In a real app, you would make an API call here
      const updatedWarranty = {
        ...data,
        status: warranty.status, // Preserve the current status
        history: [
          // Add a new history entry for the update
          {
            date: new Date().toISOString().split('T')[0],
            event: "Warranty information updated",
            type: "info"
          },
          ...warranty.history
        ]
      };

      setWarranty(updatedWarranty);
      setIsOpen(false);
      
      toast({
        title: "Success",
        description: "Warranty information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update warranty information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 max-w-6xl mx-auto">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Warranty Details</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Warranty
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[600px] sm:w-[540px] overflow-y-auto">
  <SheetHeader>
    <SheetTitle>Edit Warranty</SheetTitle>
    <SheetDescription>
      Make changes to your warranty information here.
    </SheetDescription>
  </SheetHeader>
  <div className="mt-6">
    <EditWarrantyForm
      warranty={warranty}
      onSubmit={()=> handleUpdateWarranty}
      onCancel={() => setIsOpen(false)}
      onSuccess={() => {
        setIsOpen(false);
      }}
    />
  </div>
</SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="details" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <Badge variant={getStatusBadgeVariant(warranty.status)}>
              {warranty.status.charAt(0).toUpperCase() + warranty.status.slice(1)}
            </Badge>
          </div>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>Details about your {warranty.productName}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Brand</label>
                      <p className="font-medium">{warranty.brand}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Model Number</label>
                      <p className="font-medium">{warranty.modelNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Serial Number</label>
                      <p className="font-medium">{warranty.serialNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Purchase Price</label>
                      <p className="font-medium">${warranty.purchasePrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Notes</label>
                    <p className="text-sm">{warranty.notes}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Warranty Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Warranty Status</CardTitle>
                  <CardDescription>Coverage information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center space-x-4 cursor-help">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Days Remaining</p>
                          <p className="font-medium">{getDaysRemaining()} days</p>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Warranty Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {warranty.warrantyPeriod} months coverage from purchase date
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Expiration Date</p>
                      <p className="font-medium">{getExpirationDate().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reminder Settings</label>
                    <div className="flex gap-2 flex-wrap">
                      {warranty.notifications.reminderDays.map((days, index) => (
                        <Badge key={index} variant="secondary">
                          {days} days before
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Retailer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Retailer Information</CardTitle>
                  <CardDescription>Purchase and support details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Building className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Retailer Name</p>
                      <p className="font-medium">{warranty.retailerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{warranty.retailerContact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Images</CardTitle>
                <CardDescription>Warranty documentation and product images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={warranty.receiptImage}
                        alt="Receipt"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Receipt</p>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={warranty.productImage}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Product</p>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={warranty.warrantyDocImage}
                        alt="Warranty Document"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Warranty Document</p>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Warranty History</CardTitle>
                <CardDescription>Timeline of warranty-related events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {warranty.history.map((event, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <AlertCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{event.event}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WarrantyDetails;