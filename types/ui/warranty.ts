// types/warranty.ts

export type WarrantyStatus = 'active' | 'expiring' | 'expired';
export type ViewMode = 'grid' | 'list';
export type TabType = 'all' | 'active' | 'expiring' | 'expired';

export interface Warranty {
  id: number;
  productName: string;
  brand: string;
  purchaseDate: string;
  expiryDate: string;
  status: WarrantyStatus;
  daysLeft: number;
  productImage?: string;
  serialNumber?: string;
  modelNumber?: string;
  retailer?: string;
  price?: number;
}

// Helper function to determine warranty status
export const getWarrantyStatus = (daysLeft: number): WarrantyStatus => {
    if (daysLeft <= 0) return 'expired';
    if (daysLeft <= 30) return 'expiring';
    return 'active';
  };

export interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export interface WarrantyCardProps {
  warranty: Warranty;
  onViewDetails: (id: number) => void;
}

export interface WarrantyListItemProps {
  warranty: Warranty;
  onViewDetails: (id: number) => void;
}

export interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export interface TabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}