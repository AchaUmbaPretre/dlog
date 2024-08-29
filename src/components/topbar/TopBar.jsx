import React from 'react';
import './topBar.scss';
import { useNavigate } from 'react-router-dom';
import { BellOutlined,DashOutlined } from '@ant-design/icons';
import userIcon from './../../assets/user.png'
import { useSelector } from 'react-redux';


const TopBar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="topbar-left" onClick={() => navigate('/')}>
{/*         <img src={image} alt="Logo" className="topbar-img" /> */}
        <span className="logo">DLOG</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-icons">
          <BellOutlined />
        </div>
        <hr />
        <div className="topbar-user-rows">
         <img src={userIcon} alt="" className='user-logo'/>
          <div className="topbar-name-rows">
            <span className="topbar-name">{user.nom}</span>
            <span className="topbar-sous-name">{user.role}</span>
          </div>
        </div>
        <div className="topBar-trait">
          <DashOutlined className='topbar-icon' />
        </div>
      </div>
    </div>
  );
};

export default TopBar;