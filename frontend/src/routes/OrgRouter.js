import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import Login from '../pages/tenant/Login';
import Footer from "../components/tenant/Footer";
import { Layout, Spin, message } from 'antd';
import api from '../services/api';

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
            <Content>
                <Routes>
                    <Route path="login" element={<Login orgData={orgData} />} />
                </Routes>
            </Content>
            <Footer />
        </Layout>
    );
};

export default OrgRouter;