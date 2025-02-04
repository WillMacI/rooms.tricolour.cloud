import React, { useState, useEffect } from 'react';
import { Layout, Typography, Avatar, Button, message, Modal, List, Dropdown, Menu, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {useParams, useNavigate, Link} from 'react-router-dom';
import moment from 'moment-timezone';
import api from '../../services/api';

const { Header } = Layout;
const { Title } = Typography;

const TenantHeader = ({ orgData }) => {
    const { org } = useParams();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [bookingHoursUsed, setBookingHoursUsed] = useState(0);
    const [bookingHoursAllowed, setBookingHoursAllowed] = useState(0);
    let user = null;
    if (isLoggedIn) {
        user = JSON.parse(localStorage.getItem('user'));
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.success('You have been logged out.');
        navigate(`/${org}/login`, { replace: true });
    };

    const fetchBookings = async () => {
        try {
            const response = await api.get(`/bookings/user/${user.uuid}`);
            const upcomingBookings = response.data.filter(booking =>
                moment(booking.end_time).isAfter(moment())
            );
            setBookings(upcomingBookings);
            const totalHours = upcomingBookings.reduce((acc, booking) => {
                const start = moment(booking.start_time);
                const end = moment(booking.end_time);
                return acc + end.diff(start, 'hours', true);
            }, 0);
            setBookingHoursUsed(totalHours);
        } catch (err) {
            message.error('Failed to fetch bookings.');
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await api.get(`/rooms/org/${orgData.uuid}`);
            setRooms(response.data);
        } catch (err) {
            message.error('Failed to fetch rooms.');
        }
    };

    const fetchBookingStats = async () => {
        try {
            const response = await api.get(`/bookings/statistics/${user.uuid}`);
            setBookingHoursUsed(response.data.hours_used);
            setBookingHoursAllowed(response.data.hours_allowed);
        } catch (err) {
            console.log(err)
            message.error('Failed to fetch booking stats.');
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchBookingStats();
        }
    }, [isLoggedIn]);

    const showModal = () => {
        fetchBookings();
        fetchRooms();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const roomsMap = rooms.reduce((acc, room) => {
        acc[room.uuid] = room;
        return acc;
    }, {});

    const menu = (
        <Menu>
            {isLoggedIn && (
                <>
                    <Menu.Item key="0">
                        <Tag bordered={false} color="processing">
                            {user.role}
                        </Tag>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <span><b>{bookingHoursUsed} of {bookingHoursAllowed}</b> hours used this month. </span>
                    </Menu.Item>
                    <Menu.Item key="2" danger onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                </>
            )}
        </Menu>
    );

    return (
        <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '0 20px', boxShadow: '0 2px 8px #f0f1f2' }}>
            <Avatar src={'/images/org_logos/' + orgData.logo_path} size="large" style={{ marginRight: '20px' }} />
                <Title level={3} style={{ margin: 0, flex: 1 }}><Link style={{color: 'black'}} to={'/' + org + '/rooms'}>{orgData.name}            </Link></Title>
            {isLoggedIn && (
                <>
                    <Button type="primary" onClick={showModal} style={{ marginRight: '10px' }}>My Upcoming Bookings</Button>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button icon={<UserOutlined />}>
                            {user.name}
                        </Button>
                    </Dropdown>
                </>
            )}
            <Modal title="My Upcoming Bookings" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <List
                    dataSource={bookings}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={`Room: ${roomsMap[item.room_uuid]?.name || 'Unknown Room'}`}
                                description={`Time: ${moment(item.start_time).tz('America/Toronto').format('YYYY-MM-DD HH:mm')} - ${moment(item.end_time).tz('America/Toronto').format('YYYY-MM-DD HH:mm')}`}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </Header>
    );
};

export default TenantHeader;