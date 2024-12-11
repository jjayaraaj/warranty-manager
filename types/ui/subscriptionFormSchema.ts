import { z } from "zod";

export const subscriptionFormSchema = z.object({
  id: z.number().optional(),
  serviceName: z.string().min(2, "Service name must be at least 2 characters"),
  provider: z.string().min(1, "Provider name is required"),
  planName: z.string().min(1, "Plan name is required"),
  subscriptionCost: z.number().min(0, "Cost must be a positive number"),
  billingCycle: z.enum(["monthly", "quarterly", "yearly", "custom"]),
  customBillingDays: z.number().optional(),
  startDate: z.string().min(1, "Start date is required"),
  autoRenewal: z.boolean().default(true),
  category: z.enum([
    "streaming",
    "software",
    "gaming",
    "music",
    "cloud",
    "fitness",
    "other"
  ]),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional().default(""),
  usageTracking: z.object({
    enabled: z.boolean().default(false),
    monthlyLimit: z.number().optional(),
    currentUsage: z.number().default(0),
    usageUnit: z.string().optional(),
    usageHistory: z.array(z.object({
      date: z.string(),
      amount: z.number()
    })).default([])
  }).default({
    enabled: false,
    currentUsage: 0,
    usageHistory: []
  }),
  notifications: z.object({
    paymentReminders: z.boolean().default(true),
    usageAlerts: z.boolean().default(true),
    priceChanges: z.boolean().default(true),
    reminderDays: z.array(z.number()).default([7, 3, 1])
  }).default({
    paymentReminders: true,
    usageAlerts: true,
    priceChanges: true,
    reminderDays: [7, 3, 1]
  })
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;