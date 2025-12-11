import { Skeleton } from "antd";

export const renderField = (isLoading, component) =>
  isLoading ? <Skeleton.Input active style={{ width: '100%' }} /> : component;
