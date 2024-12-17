'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Warranty {
  id: number;
  productName: string;
  brand: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'expiring';
  daysLeft: number;
  serialNumber?: string;
  modelNumber?: string;
  retailer?: string;
  price?: number;
}

const WarrantyListPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data - replace with actual data fetching
  const warranties: Warranty[] = [
    {
      id: 1,
      productName: "MacBook Pro",
      brand: "Apple",
      purchaseDate: "2024-01-15",
      expiryDate: "2025-01-15",
      status: "active",
      daysLeft: 365,
      serialNumber: "FVFF1HNAA",
      modelNumber: "A2338",
      retailer: "Apple Store",
      price: 1299.99
    },
    // Add more warranty items as needed
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredWarranties = warranties.filter(warranty => {
    const matchesSearch = warranty.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         warranty.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || warranty.brand.toLowerCase() === selectedBrand.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || warranty.status === selectedStatus;
    
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const handleWarrantyClick = (id: number) => {
    router.push(`/warranties/${id}`);
  };

  const uniqueBrands = Array.from(new Set(warranties.map(w => w.brand)));

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Warranty List</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search warranties..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {uniqueBrands.map(brand => (
                  <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWarranties.map((warranty) => (
              <TableRow 
                key={warranty.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleWarrantyClick(warranty.id)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{warranty.productName}</div>
                    <div className="text-sm text-muted-foreground">{warranty.brand}</div>
                  </div>
                </TableCell>
                <TableCell>{warranty.serialNumber}</TableCell>
                <TableCell>{warranty.purchaseDate}</TableCell>
                <TableCell>{warranty.expiryDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(warranty.status)}>
                    {warranty.status.charAt(0).toUpperCase() + warranty.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={warranty.daysLeft <= 30 ? 'destructive' : 'default'}>
                    {warranty.daysLeft} days
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/warranties/${warranty.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default WarrantyListPage;