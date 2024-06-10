'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';
import NotificationCard from '@/components/NotificationCard';

const NotificationsPage = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session || !session?.user) return;
      const id = session?.user?.id
      try {
        const response = await fetch(`/api/notifications`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        toast.error('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [session]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/mark-as-read`, {
        method: 'PUT',
      });
      const result = await response.json();
      if (result.ok) {
        setNotifications(notifications.map(notification =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        ));
        console.log(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to mark as read.');
    }
  };

  return loading ? <Spinner loading={loading}/> : !session ? (
    <div className="flex mt-10 justify-center h-screen">
      <span className="text-3xl text-pink-700">Please Sign In to view notifications</span>
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-700">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications available.</p>
      ) : (
        notifications.map(notification => (
          <NotificationCard key={notification._id} notification={notification} markAsRead={markAsRead} />
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
