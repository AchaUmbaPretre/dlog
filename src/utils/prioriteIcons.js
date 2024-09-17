import { StarFilled, StarTwoTone, StarOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

export const getPriorityIcon = (priority) => {
    switch (priority) {
        case 1:
            return <StarFilled style={{ color: '#d9534f' }} />;
        case 2:
            return <StarTwoTone twoToneColor="#f0ad4e" />;
        case 3:
            return <StarOutlined style={{ color: '#5bc0de' }} />;
        case 4:
            return <StarOutlined style={{ color: '#5cb85c' }} />;
        case 5:
            return <StarOutlined style={{ color: '#0275d8' }} />;
        default:
            return <StarOutlined />;
    }
};

export const getPriorityTag = (priority) => {
    const icon = getPriorityIcon(priority);
    
    const colorMap = {
        1: 'default',   
        2: 'blue',      
        3: 'yellow',    
        4: 'orange',    
        5: 'red'   
    };

    const priorityTextMap = {
        1: 'Très faible',
        2: 'Faible',
        3: 'Moyenne',
        4: 'Haute',
        5: 'Très haute'
    };
    
    const color = colorMap[priority] || 'default';
    
    const priorityText = priorityTextMap[priority] || 'Inconnue';
    
    return (
        <Tag icon={icon} color={color}>
            {priorityText}
        </Tag>
    );
};