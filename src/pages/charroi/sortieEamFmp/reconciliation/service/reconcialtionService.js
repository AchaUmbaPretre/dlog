import { Tag } from 'antd';
import { CloseCircleOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';


export const renderEcartTag = (v) => {
  if (v === 0) {
    return <Tag color="green" icon={<CheckCircleOutlined />}>OK</Tag>;
  }
  if (v > 0) {
    return (
      <Tag color="#faad14" icon={<ExclamationCircleOutlined />}>
        +{v}
      </Tag>
    );
  }
  return (
    <Tag color="#f5222d" icon={<CloseCircleOutlined />}>
      {v}
    </Tag>
  );
};
