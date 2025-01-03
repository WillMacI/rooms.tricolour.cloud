import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

const { Title } = Typography;

const Rooms = ({ orgData }) => {
    const { org } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get(`/rooms/org/${orgData.uuid}`);
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
                        <Link to={'/'+org+`/booking/${room.uuid}`}>
                            <Card title={room.name} style={{cursor:'pointer'}}>
                                <p>{room.description}</p>
                                <p>Capacity: {room.capacity}</p>
                            </Card>
                        </Link>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Rooms;