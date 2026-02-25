import { notification } from "antd";

export const notifyWarning = (title, desc) => {
  notification.warning({ message: title, description: desc });
};

export const notifySuccess = (title, desc) => {
  notification.success({ message: title, description: desc });
};