import React, { useEffect, useState } from 'react';
import { Select, Table, Typography, Button, Modal, Form, Input, message, Card, Tooltip } from 'antd';
import { QuestionCircleOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../../services/api';
import DataTable from '../../../components/DataTable';

const { Option } = Select;
const { Title } = Typography;

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [form] = Form.useForm();
    const userRole = JSON.parse(localStorage.getItem('user')).role;
    const userOrgUUID = JSON.parse(localStorage.getItem('user')).org_uuid;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let data;
            if (userRole !== 'super_admin') {
                const response = await api.get('/users/org/' + userOrgUUID);
                data = response.data;
            } else {
                const response = await api.get('/users');
                data = response.data;
            }
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const { data } = await api.get('/organizations');
            setOrganizations(data);
        } catch (error) {
            message.error('Failed to fetch organizations');
        }
    };

    const handleCreateOrUpdateUser = async (values) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const payload = JSON.stringify(values);
            if (editingUser) {
                await api.put(`/users/${editingUser.uuid}`, payload, config);
                message.success('User updated successfully');
            } else {
                await api.post('/users', payload, config);
                message.success('User created successfully');
            }
            fetchUsers();
            setIsModalVisible(false);
            setEditingUser(null);
            form.resetFields();
        } catch (error) {
            message.error('Failed to save user. ' + error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleDeleteUser = async (uuid) => {
        try {
            await api.delete(`/users/${uuid}`);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.organization && user.organization.name.toLowerCase().includes(query))
        );
        setFilteredUsers(filtered);
    };

    useEffect(() => {
        fetchUsers();
        fetchOrganizations();
    }, []);

    const roleMapping = {
        super_admin: 'Super Admin',
        org_admin: 'Organization Admin',
        user: 'User',
        guest: 'Guest',
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => roleMapping[role],
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteUser(record.uuid)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Card style={{ margin: '0 auto', padding: '50px 0' }}>
            <Title>Manage Users</Title>
            <Input
                placeholder="Search by name, email, or organization"
                value={searchQuery}
                onChange={handleSearch}
                style={{ marginBottom: 20 }}
            />
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                <PlusOutlined /> Add User
            </Button>
            <br /><br />
            <DataTable columns={columns} data={filteredUsers} loading={loading} />
            <Modal
                title={editingUser ? 'Edit User' : 'Create User'}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingUser(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleCreateOrUpdateUser}>
                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                Role&nbsp;
                                <Tooltip title="Admin: Can make edits to an organization. User: Can submit requests for room bookings. Guest: Can book public rooms. ">
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </span>
                        }
                        name="role"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Option value="admin">Admin</Option>
                            <Option value="user">User</Option>
                            <Option value="guest">Guest</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Organization" name="organization_uuid" rules={[{ required: true }]}>
                        {userRole === 'super_admin' ? (
                            <Select showSearch placeholder="Select an organization">
                                {organizations.map(org => (
                                    <Option key={org.uuid} value={org.uuid}>
                                        {org.name}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Input value={userOrgUUID} disabled />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ManageUsers;