'use client'

import React from 'react';
import { FieldError, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { warrantyFormSchema, type WarrantyFormValues } from '@/types/ui/warranty-form';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EditWarrantyFormProps {
  warranty: WarrantyFormValues;
  onSubmit: (data: WarrantyFormValues) => void;
  onCancel: () => void;
  onSuccess?: () => void;
}

const EditWarrantyForm = ({ warranty, onSubmit, onCancel, onSuccess }: EditWarrantyFormProps) => {
    const [mounted, setMounted] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [optimisticData, setOptimisticData] = React.useState<WarrantyFormValues | null>(null);

     // Use useEffect to handle client-side initialization
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const defaultValues = React.useMemo(() => ({
    ...warranty,
    purchaseDate: warranty.purchaseDate || format(new Date(), 'yyyy-MM-dd'),
    warrantyPeriod: warranty.warrantyPeriod || 12,
    purchasePrice: warranty.purchasePrice || 0,
    notifications: {
      email: warranty.notifications?.email ?? true,
      inApp: warranty.notifications?.inApp ?? true,
      reminderDays: warranty.notifications?.reminderDays || [30, 7, 1],
    },
  }), [warranty]);

  const form = useForm<WarrantyFormValues>({
    resolver: zodResolver(warrantyFormSchema),
    defaultValues
  });

  const handleAddReminderDay = () => {
    const currentDays = form.getValues('notifications.reminderDays') || [];
    if (currentDays.length >= 5) {
        toast({
          title: "Maximum Reminders Reached",
          description: "You can only add up to 5 reminder days.",
          variant: "destructive",
        });
        return;
      }
   
  // Ensure the new reminder day is unique
  const newDay = 0;
  if (currentDays.includes(newDay)) {
    toast({
      title: "Duplicate Reminder",
      description: "This reminder day already exists.",
      variant: "destructive",
    });
    return;
  }

  form.setValue('notifications.reminderDays', [...currentDays, newDay].sort((a, b) => b - a));
  };

  const handleRemoveReminderDay = (index: number) => {
    const currentDays = form.getValues('notifications.reminderDays') || [];
    
    form.setValue(
      'notifications.reminderDays',
      currentDays.filter((_, i) => i !== index)
    );
  };

  const handleFormSubmit = async (data: WarrantyFormValues) => {
    try {
      // Validate reminder days are in descending order
      const reminderDays = data.notifications.reminderDays;
      if (!reminderDays.every((v, i, a) => !i || a[i - 1] > v)) {
        toast({
          title: "Validation Error",
          description: "Reminder days must be in descending order",
          variant: "destructive",
        });
        return;
      }
  
      setSubmitError(null);
      setIsSubmitting(true);
      setOptimisticData(data);
  
      await onSubmit(data);
  
      toast({
        title: "Success",
        description: "Warranty information has been updated.",
      });
    } catch (error) {
      setOptimisticData(null);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving';
      setSubmitError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Custom validation messages
  const getFieldError = (fieldName: string, error?: FieldError) => {
    if (!error) return null;
    
    const customMessages: Record<string, Record<string, string>> = {
      productName: {
        min: "Product name must be at least 2 characters",
        max: "Product name is too long",
        pattern: "Product name can only contain letters, numbers, spaces, and hyphens"
      },
      purchasePrice: {
        min: "Price must be a positive number",
        max: "Price is too high",
        type: "Please enter a valid number"
      },
      // Add more field-specific messages...
    };
  
    return customMessages[fieldName]?.[error.type] || error.message;
  };

   // Prevent rendering form content until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const displayData = optimisticData || warranty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      {submitError && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} disabled={isSubmitting} className={cn(
                          fieldState.error && "border-red-500 focus-visible:ring-red-500"
                          
                        ) }
                        
                        aria-invalid={fieldState.error ? "true" : "false"}
                        />
                    </FormControl>
                    {fieldState.error && (
        <FormMessage>
          {getFieldError('productName', fieldState.error)}
        </FormMessage>
      )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Purchase Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Purchase Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Period (months)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[12, 24, 36, 48, 60].map((months) => (
                          <SelectItem key={months} value={months.toString()}>
                            {months} months
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Retailer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Retailer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="retailerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retailer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter retailer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="retailerContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retailer Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notifications.email"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>
                        Receive warranty updates via email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifications.inApp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">In-App Notifications</FormLabel>
                      <FormDescription>
                        Receive notifications within the app
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifications.reminderDays"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-4">
                    <FormLabel className="text-base">Reminder Days</FormLabel>
                    <FormDescription className="mb-4">
                      Get notified before warranty expiration
                    </FormDescription>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((days, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {days} days
                            <button
                              type="button"
                              onClick={() => handleRemoveReminderDay(index)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddReminderDay}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Reminder
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Notes</h3>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about the warranty..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditWarrantyForm;