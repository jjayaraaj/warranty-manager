// types/ui/subscription.ts

export interface SubscriptionUsageTracking {
    enabled: boolean;
    monthlyLimit?: number;
    currentUsage: number;
    usageUnit?: string;
    usageHistory: Array<{
      date: string;
      amount: number;
    }>;
  }
  
  export interface SubscriptionNotifications {
    paymentReminders: boolean;
    usageAlerts: boolean;
    priceChanges: boolean;
    reminderDays: number[];
  }
  
  export interface Subscription {
    id?: number;
    serviceName: string;
    provider: string;
    planName: string;
    subscriptionCost: number;
    billingCycle: BillingCycle;
    customBillingDays?: number;
    startDate: string;
    autoRenewal: boolean;
    category: "streaming" | "software" | "gaming" | "music" | "cloud" | "fitness" | "other";
    paymentMethod: string;
    notes: string;
    usageTracking: SubscriptionUsageTracking;
    notifications: SubscriptionNotifications;
  }
  
  export type SubscriptionFormValues = Omit<Subscription, 'id'>;

  export type BillingCycle = "monthly" | "quarterly" | "yearly" | "custom";