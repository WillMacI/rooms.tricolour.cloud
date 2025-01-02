import React from 'react';
import { Image, Button, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;


const AdminHeader = () => {
    const navigate = useNavigate();
    const menuItems = [
        { key: '1', label: 'Dashboard', onClick: () => navigate('/admin/dashboard') },
        { key: '2', label: 'Manage Users', onClick: () => navigate('/admin/manage-users') },
        { key: '3', label: 'Manage Organizations', onClick: () => navigate('/admin/manage-organizations') },
        { key: '4', label: 'Logout', onClick: () => {
                localStorage.clear();
                navigate('/admin/login');
            }},
    ];

    return (

        <Header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div className="logo" style={{color: 'white', fontSize: '20px'}}>
                <Image src={'/images/TCC_Logo.png'} style={{width: 50, marginRight: 10}}/>
            </div>
            <Menu theme="dark" mode="horizontal" items={menuItems}/>

        </Header>
    );
}
export default AdminHeader