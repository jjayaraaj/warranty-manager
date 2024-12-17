import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SubscriptionFormValues } from '@/types/ui/subscription';
import { subscriptionFormSchema } from '@/types/ui/subscriptionFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { PlusCircle } from 'lucide-react';

import React from 'react'
import { useForm } from 'react-hook-form';

const AddSubscription = () => {
    const [open, setOpen] = React.useState(false);
    const form = useForm<SubscriptionFormValues>({
        resolver: zodResolver(subscriptionFormSchema),
        defaultValues:{
            serviceName: "",
            provider: "",
            planName: "",
            subscriptionCost: 0,
            billingCycle: "monthly",
            // startDate: new Date().toISOString().split('T')[0],
            autoRenewal: true,
            category: "other",
            paymentMethod: "",
            notes: "",
           
        }
    })

    const handleSubmit =  (data: SubscriptionFormValues) => {
        console.log(data)
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button>
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Subscription
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Warranty</DialogTitle>
        <DialogDescription>
          Enter the details of your warranty. All fields marked with * are required.
        </DialogDescription>
      </DialogHeader>
      <Form  {...form} >
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Netflix, Spotify, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Netflix, Spotify, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subscriptionCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="billingCycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="streaming">Streaming</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> 

               <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="autoRenewal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Auto Renewal</FormLabel>
                    <FormDescription>
                      Automatically renew this subscription
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

               <DialogFooter>
            <Button 
                type="submit" 
                
              >
                Add Subscription
              </Button>
              
            </DialogFooter>

        </form>
      </Form>
      </DialogContent></Dialog>

  )
}

export  {AddSubscription}