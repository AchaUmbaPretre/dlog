import { Tag } from 'antd';
import {
  ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

export const renderDate = (date) =>
  moment(date).format('DD-MM-YYYY');


export const renderStatus = (status) => {
  const map = {
    PROPOSEE: { color: 'orange', label: 'Proposée' },
    VALIDEE: { color: 'green', label: 'Validée' },
    REFUSEE: { color: 'red', label: 'Refusée' }
  };

  const s = map[status] || { color: 'default', label: status };

  return (
    <Tag color={s.color} icon={<ClockCircleOutlined />}>
      {s.label}
    </Tag>
  );
};