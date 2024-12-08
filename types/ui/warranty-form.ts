// types/ui/warranty-form.ts
import { z } from "zod";

export const warrantyFormSchema = z.object({
  productName: z.string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Product name can only contain letters, numbers, spaces, and hyphens"),
  
  brand: z.string()
    .min(1, "Brand is required")
    .max(50, "Brand name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Brand can only contain letters, numbers, spaces, and hyphens"),
  
  modelNumber: z.string()
    .min(1, "Model number is required")
    .max(50, "Model number cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Model number can only contain letters, numbers, and hyphens"),
  
  serialNumber: z.string()
    .min(1, "Serial number is required")
    .max(50, "Serial number cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Serial number can only contain letters, numbers, and hyphens"),
  
  purchaseDate: z.string()
    .min(1, "Purchase date is required")
    .refine((date) => {
      const purchaseDate = new Date(date);
      const today = new Date();
      return purchaseDate <= today;
    }, "Purchase date cannot be in the future"),
  
  warrantyPeriod: z.number()
    .int("Warranty period must be a whole number")
    .min(1, "Warranty period must be at least 1 month")
    .max(120, "Warranty period cannot exceed 120 months")
    .default(12),
  
  purchasePrice: z.number()
    .min(0, "Price must be a positive number")
    .max(1000000, "Price cannot exceed 1,000,000")
    .transform((val) => Number(val.toFixed(2))), // Round to 2 decimal places
  
  retailerName: z.string()
    .min(1, "Retailer name is required")
    .max(100, "Retailer name cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s&'-]+$/, "Retailer name can only contain letters, numbers, spaces, &, ', and -"),
  
  retailerContact: z.string()
    .min(1, "Retailer contact is required")
    .max(50, "Contact information cannot exceed 50 characters")
    .regex(
      /^([+]?\d{1,3}[-\s]?)?\d{10}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid phone number or email address"
    ),
  
  notes: z.string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .default(""),
  
  receiptImage: z.string()
    .optional()
    .default(""),
  
  productImage: z.string()
    .optional()
    .default(""),
  
  warrantyDocImage: z.string()
    .optional()
    .default(""),
  
  notifications: z.object({
    email: z.boolean().default(true),
    inApp: z.boolean().default(true),
    reminderDays: z.array(z.number()
      .int("Reminder days must be whole numbers")
      .min(1, "Reminder days must be at least 1")
      .max(365, "Reminder days cannot exceed 365")
    )
    .min(1, "At least one reminder day is required")
    .max(5, "Cannot have more than 5 reminder days")
    .refine(
      (days) => new Set(days).size === days.length,
      "Duplicate reminder days are not allowed"
    )
    .default([30, 7, 1])
  }).default({
    email: true,
    inApp: true,
    reminderDays: [30, 7, 1]
  })
});

export type WarrantyFormValues = z.infer<typeof warrantyFormSchema>;