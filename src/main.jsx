import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

// const beamsClient = new PusherPushNotifications.Client({
//   instanceId: "a701f499-cd7c-4320-bd1c-170e7307f91e",
// });

// beamsClient
//   .start()
//   .then(() => beamsClient.addDeviceInterest("hello"))
//   .then(() => console.log("Đăng ký nhận thông báo Beams thành công!"))
//   .catch(console.error);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
