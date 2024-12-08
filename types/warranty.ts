// types/warranty.ts
export interface IWarranty {
    _id?: string;
    userId: string;
    productName: string;
    brand: string;
    modelNumber: string;
    serialNumber: string;
    purchaseDate: Date;
    warrantyPeriod: number; // in months
    expiryDate: Date;
    purchasePrice: number;
    retailerName: string;
    retailerContact: string;
    receiptImage?: string;
    productImage?: string;
    warrantyDocImage?: string;
    status: 'active' | 'expired' | 'claimed';
    notes?: string;
    claimHistory?: {
      date: Date;
      description: string;
      status: 'pending' | 'approved' | 'rejected';
    }[];
    notifications: {
      email: boolean;
      inApp: boolean;
      reminderDays: number[]; // days before expiry to notify
    };
    createdAt: Date;
    updatedAt: Date;
  }
  
  // models/Warranty.ts
  import mongoose, { Schema } from 'mongoose';
  
  const warrantySchema = new Schema<IWarranty>({
    userId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    modelNumber: { type: String, required: true },
    serialNumber: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    warrantyPeriod: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    retailerName: { type: String, required: true },
    retailerContact: { type: String, required: true },
    receiptImage: { type: String },
    productImage: { type: String },
    warrantyDocImage: { type: String },
    status: { 
      type: String, 
      enum: ['active', 'expired', 'claimed'],
      required: true,
      default: 'active'
    },
    notes: { type: String },
    claimHistory: [{
      date: { type: Date, required: true },
      description: { type: String, required: true },
      status: { 
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true
      }
    }],
    notifications: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      reminderDays: { type: [Number], default: [30, 7, 1] } // Default reminders at 30, 7, and 1 day before expiry
    }
  }, {
    timestamps: true
  });
  
  // Create indexes for better query performance
  warrantySchema.index({ expiryDate: 1 });
  warrantySchema.index({ status: 1 });
  
  export const Warranty = mongoose.models.Warranty || mongoose.model('Warranty', warrantySchema);