import { z } from "zod";

export const subscriptionFormSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  provider: z.string().min(1, "Provider name is required"),
   planName: z.string().optional().default(""),
   subscriptionCost: z.number().min(0, "Cost must be a positive number"),
   billingCycle: z.enum(["monthly", "quarterly", "yearly", "custom"]),
  startDate: z.string().min(1, "Start date is required"),
  autoRenewal: z.boolean().default(true),
   category: z.enum(["streaming", "software", "gaming", "music", "cloud", "fitness", "other"]),
  paymentMethod: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  usageTracking: z.object({
    enabled: z.boolean().default(false),
    currentUsage: z.number().default(0),
    usageHistory: z.array(z.object({
      date: z.string(),
      amount: z.number()
    })).default([])
  }).optional().default({
    enabled: false,
    currentUsage: 0,
    usageHistory: []
  }),
  notifications: z.object({
    paymentReminders: z.boolean().default(true),
    usageAlerts: z.boolean().default(true),
    priceChanges: z.boolean().default(true),
    reminderDays: z.array(z.number()).default([7, 3, 1])
  }).optional().default({
    paymentReminders: true,
    usageAlerts: true,
    priceChanges: true,
    reminderDays: [7, 3, 1]
  })
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;