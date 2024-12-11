import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CreditCard, 
  BarChart,
  AlertTriangle,
} from 'lucide-react';

const SubscriptionCard = ({ subscription }) => {
  const getNextBillingDate = () => {
    const startDate = new Date(subscription.startDate);
    const today = new Date();
    let nextBilling = new Date(startDate);

    while (nextBilling <= today) {
      if (subscription.billingCycle === 'monthly') {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      } else if (subscription.billingCycle === 'quarterly') {
        nextBilling.setMonth(nextBilling.getMonth() + 3);
      } else if (subscription.billingCycle === 'yearly') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      }
    }

    return nextBilling;
  };

  const getUsagePercentage = () => {
    if (!subscription.usageTracking.enabled || !subscription.usageTracking.monthlyLimit) {
      return 0;
    }
    return (subscription.usageTracking.currentUsage / subscription.usageTracking.monthlyLimit) * 100;
  };

  const usagePercentage = getUsagePercentage();
  const nextBillingDate = getNextBillingDate();
  const daysUntilBilling = Math.ceil((nextBillingDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold">{subscription.serviceName}</h3>
            <Badge variant={subscription.autoRenewal ? "default" : "secondary"}>
              {subscription.billingCycle}
            </Badge>
          </div>
          <Badge variant="outline" className="capitalize">
            {subscription.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{subscription.provider}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              ${subscription.subscriptionCost.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {daysUntilBilling} days left
            </span>
          </div>
        </div>

        {subscription.usageTracking.enabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center space-x-2">
                <BarChart className="w-4 h-4 text-muted-foreground" />
                <span>Usage</span>
              </span>
              <span>
                {subscription.usageTracking.currentUsage} / 
                {subscription.usageTracking.monthlyLimit} 
                {subscription.usageTracking.usageUnit}
              </span>
            </div>
            <div className="space-y-1">
              <Progress value={usagePercentage} />
              {usagePercentage > 90 && (
                <div className="flex items-center space-x-1 text-amber-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">Near limit</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;