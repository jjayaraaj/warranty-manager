'use client'
import React, { useState } from 'react';
import { AlertCircle, Plus, Calendar, Phone, ArrowUpDown, Mail, Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type ClaimStatus = 'pending' | 'inProgress' | 'approved' | 'rejected' | 'completed';
type StatusVariant = 'default' | 'secondary' | 'success' | 'destructive' | 'outline';

interface ClaimStatusOption {
  value: ClaimStatus;
  label: string;
}

interface Claim {
  id: number;
  referenceNumber: string;
  dateSubmitted: string;
  status: ClaimStatus;
  claimType: string;
  description: string;
  providerResponse: string;
  lastUpdated: string;
  nextAction: string;
  nextActionDate: string;
  communications: Array<{
    date: string;
    method: string;
    notes: string;
  }>;
}

const WarrantyClaimPage = ({ warrantyId }: { warrantyId: string }) => {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: 1,
      referenceNumber: "CLM-2024-001",
      dateSubmitted: "2024-03-15",
      status: "pending",
      claimType: "defect",
      description: "Screen flickering issue",
      providerResponse: "Awaiting inspection appointment",
      lastUpdated: "2024-03-18",
      nextAction: "Schedule inspection",
      nextActionDate: "2024-03-25",
      communications: [
        { date: "2024-03-15", method: "email", notes: "Claim submitted online" },
        { date: "2024-03-18", method: "phone", notes: "Called to confirm receipt" }
      ]
    }
  ]);
  
  const [isAddingClaim, setIsAddingClaim] = useState(false);

  const claimTypes = [
    { value: "defect", label: "Product Defect" },
    { value: "damage", label: "Accidental Damage" },
    { value: "malfunction", label: "Product Malfunction" },
    { value: "other", label: "Other Issues" }
  ];

  const claimStatuses = [
    { value: "pending", label: "Pending" },
    { value: "inProgress", label: "In Progress" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "completed", label: "Completed" }
  ];

  const getStatusBadgeVariant = (status: ClaimStatus) => {
    const variants: Record<ClaimStatus, StatusVariant> = {
      pending: "secondary",
      inProgress: "default",
      approved: "success",
      rejected: "destructive",
      completed: "outline"
    };
    return variants[status] || "default";
  };

  return (
    <div className="space-y-6">
      {/* Claims Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Warranty Claims</CardTitle>
            <CardDescription>Track and manage your warranty claims</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record New Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Warranty Claim</DialogTitle>
                <DialogDescription>
                  Enter the details of your warranty claim interaction
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel>Reference Number</FormLabel>
                    <Input placeholder="e.g., CLM-2024-002" />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Date Submitted</FormLabel>
                    <Input type="date" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel>Claim Type</FormLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        {claimTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Status</FormLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {claimStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>Issue Description</FormLabel>
                  <Textarea placeholder="Describe the issue and your claim details..." />
                </div>

                <div className="space-y-2">
                  <FormLabel>Provider Response</FormLabel>
                  <Textarea placeholder="Enter any response received from the warranty provider..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel>Next Action</FormLabel>
                    <Input placeholder="e.g., Follow up call" />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Next Action Date</FormLabel>
                    <Input type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>Upload Documents</FormLabel>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload relevant documents or images
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsAddingClaim(false)}>
                  Cancel
                </Button>
                <Button>Save Claim Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Action</TableHead>
                <TableHead>Action Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.referenceNumber}</TableCell>
                  <TableCell>{claim.dateSubmitted}</TableCell>
                  <TableCell>{claim.claimType}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(claim.status)}>
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.nextAction}</TableCell>
                  <TableCell>{claim.nextActionDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyClaimPage;