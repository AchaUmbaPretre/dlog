import { useEffect, useState } from 'react'
import { Input, Button, Tabs, Menu, Tooltip, Typography, message, Skeleton, Tag, Table, Space, Dropdown, Modal, notification } from 'antd';
import moment from 'moment';

const SortieEntree = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
  return (
    <div>SortieEntree</div>
  )
}

export default SortieEntree