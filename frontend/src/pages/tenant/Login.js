import React, { useState } from 'react';
import { Form, Image, Input, Button, Typography, message, Tooltip, Card, Layout } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../../services/api';
import { Content } from "antd/es/layout/layout";

const { Title, Text } = Typography;

const Login = ({ orgData }) => {
    console.log(process.env.REACT_APP_RECAPTCHA_SITE_KEY)
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const { org } = useParams();
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!captchaToken) {
            message.error('Please complete the CAPTCHA');
            return;
        }

        try {
            const response = await api.post('/auth/send-otp', { email, org_slug: org, captchaToken });
            if (response.status === 200) {
                setStep(2);
                message.success('OTP sent successfully');
            }
        } catch (error) {
            setError(error.response.data.error);
            message.error(error.response.data.error);
        }
    };

    const handleCheckOtp = async () => {
        try {
            const response = await api.post('/auth/check-otp', { OTP: otp, email, org_slug: org });
            if (response.status === 200) {
                message.success('Login successful');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate(`/${org}/rooms`, { replace: true });
            }
        } catch (error) {
            setError(error.response.data.error);
            message.error(error.response.data.error);
        }
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    return (
        <Content style={{ padding: '20px' }}>
            <Card style={{ maxWidth: 400, margin: '0 auto', padding: '20px', textAlign: 'center' }}>
                <Image src={'/images/org_logos/' + orgData.logo_path} style={{ width: '50%', marginBottom: '20px' }} />
                <Title level={2} style={{ textAlign: 'center' }}>{ orgData.name }</Title>
                {step === 1 && (
                    <Form layout="vertical" onFinish={handleSendOtp}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={`@${orgData.settings.authentication.domain_email_whitelist[0]}`}
                            />
                        </Form.Item>
                        <Form.Item>
                            <ReCAPTCHA
                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                onChange={handleCaptchaChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>Send OTP</Button>
                        </Form.Item>
                        <Text type="secondary">
                            Please login with your {orgData.settings.authentication.domain_email_whitelist.map((email, index) => (
                            <span key={index}>
                                {index === orgData.settings.authentication.domain_email_whitelist.length - 1 ? 'or ' : ''}
                                {'@' + email}
                                {index < orgData.settings.authentication.domain_email_whitelist.length - 1 ? ', ' : ''}
                            </span>
                        ))} email address.
                        </Text>
                    </Form>
                )}
                {step === 2 && (
                    <Form layout="vertical" onFinish={handleCheckOtp}>
                        <Form.Item label="OTP" name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
                            <Input value={otp} placeholder="822159" onChange={(e) => setOtp(e.target.value)} suffix={
                                <Tooltip title="A One-Time Password (OTP) is a code sent to your email to verify your identity.">
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            } />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>Login</Button>
                        </Form.Item>
                    </Form>
                )}
                {error && <Text type="danger">{error}</Text>}
            </Card>
        </Content>
    );
};

export default Login;