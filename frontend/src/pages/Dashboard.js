import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get('/rooms');
                setRooms(response.data);
            } catch (err) {
                console.error('Failed to fetch rooms:', err);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room.uuid}>
                        {room.name} (Capacity: {room.capacity})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
