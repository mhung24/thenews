import React, { useState, useCallback, useMemo, useEffect } from "react";
import { NotificationContext } from "./NotificationContext";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import Pusher from "pusher-js";
import api from "../services/articleService";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [
      {
        id: notif.id || Date.now(),
        time: "Vừa xong",
        isRead: false,
        ...notif,
      },
      ...prev,
    ]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      const res = await api.get("/notifications");
      const incomingData = res.data?.data || res.data;

      if (Array.isArray(incomingData)) {
        setNotifications(incomingData);
      }
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    }
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await fetchNotifications();
      } catch (error) {
        console.error(error);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);

        // --- 1. Cấu hình Pusher Beams (Thông báo Popup OS) ---
        const beamsClient = new PusherPushNotifications.Client({
          instanceId: import.meta.env.VITE_PUSHER_BEAMS_INSTANCE_ID, // a701f499...
        });

        beamsClient
          .start()
          .then(() => {
            if (user.role === "author") {
              return beamsClient.addDeviceInterest(`author-${user.id}`);
            }
            if (user.role === "moderator" || user.role === "admin") {
              return beamsClient.addDeviceInterest("moderators"); // Moderator đăng ký nhận tin bài mới
            }
          })
          .catch(console.error);

        // --- 2. Cấu hình Pusher Channels (Nhảy số/Thông báo Web ngay lập tức) ---
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
          // b9fb648a...
          cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // ap1
          forceTLS: true,
        });

        if (user.role === "moderator" || user.role === "admin") {
          const modChannel = pusher.subscribe("moderator-notifications");
          modChannel.bind("new-article-submitted", () => {
            fetchNotifications();
          });
        }

        if (user.role === "author") {
          const authorChannel = pusher.subscribe(`author-channel-${user.id}`);
          authorChannel.bind("article-status-updated", () => {
            fetchNotifications();
          });
        }

        return () => {
          pusher.disconnect();
        };
      } catch (e) {
        console.error("Auth/Pusher error:", e);
      }
    }
  }, [fetchNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      addNotification,
      markAsRead,
      refreshNotifications: fetchNotifications,
    }),
    [notifications, addNotification, markAsRead, fetchNotifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
