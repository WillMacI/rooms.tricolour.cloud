import React, { useEffect, useState } from 'react';
import { Table, Typography, Button, Modal, Form, Input, message, Card, Select, Upload } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import api from '../../../services/api';
import DataTable from '../../../components/DataTable';

const { Title } = Typography;
const { Option } = Select;

const ManageOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingOrganization, setEditingOrganization] = useState(null);
    const [form] = Form.useForm();
    const [color, setColor] = useState('#000000');

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/organizations');
            setOrganizations(data);
        } catch (error) {
            message.error('Failed to fetch organizations');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            message.error('Failed to fetch users');
        }
    };

    const handleCreateOrUpdateOrganization = async (values) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            values.primary_color = color; // Set the primary color to the selected color
            const payload = JSON.stringify(values);
            if (editingOrganization) {
                await api.put(`/organizations/${editingOrganization.uuid}`, payload, config);
                message.success('Organization updated successfully');
            } else {
                await api.post('/organizations', payload, config);
                message.success('Organization created successfully');
            }
            fetchOrganizations();
            setIsModalVisible(false);
            setEditingOrganization(null);
            form.resetFields();
        } catch (error) {
            message.error('Failed to save organization. ' + error);
        }
    };

    const handleEditOrganization = (organization) => {
        setEditingOrganization(organization);
        form.setFieldsValue(organization);
        setColor(organization.primary_color); // Set the color picker to the organization's primary color
        setIsModalVisible(true);
    };

    const handleDeleteOrganization = async (uuid) => {
        try {
            await api.delete(`/organizations/${uuid}`);
            message.success('Organization deleted successfully');
            fetchOrganizations();
        } catch (error) {
            message.error('Failed to delete organization');
        }
    };

    useEffect(() => {
        fetchOrganizations();
        fetchUsers();
    }, []);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditOrganization(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteOrganization(record.uuid)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const uploadProps = {
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                form.setFieldsValue({ logo_path: e.target.result });
            };
            reader.readAsDataURL(file);
            return false;
        },
    };

    return (
        <Card style={{ margin: '0 auto', padding: '50px 0' }}>
            <Title>Manage Organizations</Title>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                <PlusOutlined /> Add Organization
            </Button>
            <br /><br />
            <DataTable columns={columns} data={organizations} loading={loading} />
            <Modal
                title={editingOrganization ? 'Edit Organization' : 'Create Organization'}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingOrganization(null);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleCreateOrUpdateOrganization}>
                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Super Admin" name="super_admin_uuid" rules={[{ required: true }]}>
                        <Select showSearch placeholder="Select a super admin">
                            {users.map(user => (
                                <Option key={user.uuid} value={user.uuid}>
                                    {user.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Logo" name="logo_path">
                        <Upload {...uploadProps} listType="picture">
                            <Button icon={<UploadOutlined />}>Upload Logo</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Primary Color" name="primary_color" rules={[{ required: true }]}>
                        <SketchPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
                    </Form.Item>
                    <Form.Item label="Booking Rules" name="booking_rules">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ManageOrganizations;