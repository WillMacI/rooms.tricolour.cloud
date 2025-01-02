import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/users/ManageUsers';
import ManageOrganizations from '../pages/admin/organizations/ManageOrganizations';
import Login from '../pages/admin/Login';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminHeader from '../components/admin/Header';
import AdminFooter from '../components/admin/Footer';
import AdminLogout from '../services/admin/logout';
import { Layout } from 'antd';

const { Content } = Layout;

const AdminRouter = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {user && <AdminHeader />}
            <Content style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manage-users"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                                <ManageUsers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manage-organizations"
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <ManageOrganizations />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/logout"
                        element={
                                <AdminLogout />
                        }
                    />
                </Routes>
            </Content>
            <AdminFooter />
        </Layout>
    );
};

export default AdminRouter;