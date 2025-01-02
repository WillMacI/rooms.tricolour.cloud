import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin, message } from 'antd';
import api from '../../services/api';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const Rooms = () => {
    const { org } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get(`/organizations/${org}/rooms`);
                setRooms(response.data);
            } catch (error) {
                message.error('Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [org]);

    if (loading) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Rooms</Title>
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={rooms}
                renderItem={room => (
                    <List.Item>
                        <Card title={room.name}>
                            <p>{room.description}</p>
                            <p>Capacity: {room.capacity}</p>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Rooms;