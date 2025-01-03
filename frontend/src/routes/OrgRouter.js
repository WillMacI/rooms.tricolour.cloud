import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/tenant/Header';
import Login from '../pages/tenant/Login';
import Rooms from '../pages/tenant/Rooms';
import Booking from '../pages/tenant/Booking';
import Footer from "../components/tenant/Footer";
import { Layout, Spin, message } from 'antd';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const { Content } = Layout;

const OrgRouter = () => {
    const { org } = useParams();
    console.log(org);
    const navigate = useNavigate();
    const [orgData, setOrgData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const response = await api.get(`/organizations/slug/${org}`);
                setOrgData(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    message.error('Organization not found');
                    navigate('/404'); // Redirect to a 404 page or handle as needed
                } else {
                    message.error('Failed to fetch organization data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrgData();
    }, [org, navigate]);

    if (loading) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header orgData={orgData} />
            <Content>
                <Routes>
                    <Route path="login" element={<Login orgData={orgData} />} />
                    <Route
                        path="rooms"
                        element={
                            <ProtectedRoute allowedRoles={['guest', 'user', 'admin', 'super_user']}>
                                <Rooms orgData={orgData} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="booking/:room_uuid"
                        element={
                            <ProtectedRoute allowedRoles={['guest', 'user', 'admin', 'super_user']}>
                                <Booking orgData={orgData} />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Content>
            <Footer />
        </Layout>
    );
};

export default OrgRouter;