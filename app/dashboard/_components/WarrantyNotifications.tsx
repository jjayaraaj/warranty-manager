import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type NotificationType = 'warning' | 'success' | 'error' | 'info';

interface Notification {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  date: string;
  read: boolean;
}

const WarrantyNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Warranty Expiring Soon',
      description: 'MacBook Pro warranty expires in 30 days',
      type: 'warning',
      date: '2024-01-15',
      read: false
    },
    {
      id: 2,
      title: 'Documentation Verified',
      description: 'Your warranty documentation has been verified successfully',
      type: 'success',
      date: '2024-01-10',
      read: false
    },
    {
      id: 3,
      title: 'Warranty Expired',
      description: 'iPhone 13 Pro warranty has expired',
      type: 'error',
      date: '2024-01-05',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number): void => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getNotificationBadgeColor = (type: NotificationType): string => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated on your warranty status and events
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications available
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`${notification.read ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {notification.title}
                      </CardTitle>
                      <Badge 
                        variant="secondary"
                        className={getNotificationBadgeColor(notification.type)}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-gray-500">
                      {formatDate(notification.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm">{notification.description}</p>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default WarrantyNotifications;