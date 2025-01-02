import React, { useState } from 'react';
import {Image, Form, Input, Button, Typography, message, Card} from 'antd';
import api from '../../services/api';

import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = ({ onLogin = () => {} }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    if(localStorage.getItem('user')) {
        navigate('/admin/dashboard', { replace: true });
    }
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            //Login and grab user information
            const response = await api.post('/auth/login', values);
            localStorage.setItem('token', response.data.token); // Save token to localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user info to localStorage
            if(response.data.user.role === 'admin') {
                //If a user is an admin only load organizational data that they belong to.
                const organization_uuid = response.data.user.org_uuid;
                const organization_data = await api.get('/organizations/uuid/' + organization_uuid);
                localStorage.setItem('organization', JSON.stringify(organization_data)); // Save org info to localStorage
            }
            onLogin();
            navigate('/admin/dashboard', { replace: true });
        } catch (err) {
            console.log(err);
            message.error('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (

        <Card style={{ textAlign: 'center', maxWidth: 300, margin: '0 auto', padding: '50px 0' }}>
            <Image src="/images/TCC_Logo.png" style={{ width: 100, margin: '0 auto 20px', display: 'block' }} />
            <Title level={2} style={{ textAlign: 'center' }}>Room Booking System</Title>
            <Form
                name="login"
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default Login;