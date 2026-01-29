import { notification } from "antd";

export const notifyWarning = (title, desc) => {
  notification.warning({ message: title, description: desc });
};