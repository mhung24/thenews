// import React, { createContext, useState, useCallback, useMemo } from 'react';

// export const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//     const [notifications, setNotifications] = useState([
//         { id: 1, title: 'Hệ thống', message: 'Chào mừng bạn quay lại!', type: 'info', time: 'Vừa xong', isRead: false }
//     ]);

//     const addNotification = useCallback((notif) => {
//         setNotifications(prev => [
//             { id: Date.now(), time: 'Vừa xong', isRead: false, ...notif },
//             ...prev
//         ]);
//     }, []);

//     const markAsRead = useCallback((id) => {
//         setNotifications(prev =>
//             prev.map(n => n.id === id ? { ...n, isRead: true } : n)
//         );
//     }, []);

//     // Dùng useMemo để tối ưu hiệu năng
//     const value = useMemo(() => ({
//         notifications,
//         addNotification,
//         markAsRead
//     }), [notifications, addNotification, markAsRead]);

//     return (
//         <NotificationContext.Provider value={value}>
//             {children}
//         </NotificationContext.Provider>
//     );
// };
