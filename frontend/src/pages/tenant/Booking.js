import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment-timezone';
import axios from 'axios';
import { Spin, Alert, Button, Breadcrumb, message } from 'antd';
import api from '../../services/api';
import '../../styles/Booking.css';

const Booking = ({ orgData }) => {
    const { org, room_uuid } = useParams();
    const [bookings, setBookings] = useState([]);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(moment().tz('America/Toronto').toDate());
    const user = JSON.parse(localStorage.getItem('user'));

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push(`${hour}:00`, `${hour}:30`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const [bookingsResponse, roomResponse] = await Promise.all([
                    api.get(`/bookings/room/${room_uuid}?date=${moment(currentDate).format('YYYY-MM-DD')}`),
                    api.get(`/rooms/uuid/${room_uuid}`)
                ]);
                setBookings(bookingsResponse.data);
                setRoom(roomResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [room_uuid, currentDate]);

    const isSlotBooked = (time) => {
        return bookings.some((booking) => {
            const start = moment(booking.start_time).tz('America/Toronto');
            const end = moment(booking.end_time).tz('America/Toronto');
            const slotTime = moment(currentDate)
                .tz('America/Toronto')
                .hour(parseInt(time.split(':')[0], 10))
                .minute(parseInt(time.split(':')[1], 10));
            return slotTime.isBetween(start, end, null, '[)');
        });
    };

    const isSlotOccupiedByUser = (time) => {
        return bookings.some((booking) => {
            const start = moment(booking.start_time).tz('America/Toronto');
            const end = moment(booking.end_time).tz('America/Toronto');
            const slotTime = moment(currentDate)
                .tz('America/Toronto')
                .hour(parseInt(time.split(':')[0], 10))
                .minute(parseInt(time.split(':')[1], 10));
            return slotTime.isBetween(start, end, null, '[)') && booking.user_uuid === user.uuid;
        });
    };

    const getCurrentTimeOffset = () => {
        const now = moment().tz('America/Toronto');
        const startOfDay = moment(currentDate).tz('America/Toronto').startOf('day');

        if (!now.isSame(startOfDay, 'day')) return null;

        const totalMinutesInDay = 1440;
        const minutesSinceStartOfDay = now.diff(startOfDay, 'minutes');
        const offsetPercentage = (minutesSinceStartOfDay / totalMinutesInDay) * 100;

        return offsetPercentage;
    };

    const handleDateChange = (direction) => {
        const newDate = moment(currentDate).tz('America/Toronto').add(direction, 'days').toDate();
        setCurrentDate(newDate);
    };

    const handleSlotClick = async (time) => {
        if (isSlotBooked(time)) {
            message.error('This slot is already booked.');
            return;
        }

        try {
            const slotTime = moment(currentDate)
                .tz('America/Toronto')
                .hour(parseInt(time.split(':')[0], 10))
                .minute(parseInt(time.split(':')[1], 10));

            const response = await api.post('/bookings', {
                room_uuid: room_uuid,
                org_uuid: orgData.uuid,
                start_time: slotTime.toISOString(),
                end_time: slotTime.add(30, 'minutes').toISOString(),
            });
            if (response.status === 201) {
                message.success('Booking successful');
                setBookings([...bookings, response.data]);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Booking failed';
            message.error(errorMessage);
        }
    };

    const currentTimeOffset = getCurrentTimeOffset();

    if (loading) {
        return (
            <Spin
                size="large"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            />
        );
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={'/' + org + '/rooms'}>{orgData.name} Rooms</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {room ? room.name : 'Room'}
                </Breadcrumb.Item>
            </Breadcrumb>
            <br />
            <h1>Room Booking for {moment(currentDate).tz('America/Toronto').format('dddd, MMMM D, YYYY')}</h1>
            {room && <h2>{room.name}</h2>}
            <div className="date-navigation">
                <Button onClick={() => handleDateChange(-1)}>Previous Day</Button>
                <Button onClick={() => handleDateChange(1)}>Next Day</Button>
            </div>
            <br />
            <div className="color-key">
                <div className="key-item">
                    <div className="key-color available"></div>
                    <span>Available</span>
                </div>
                <div className="key-item">
                    <div className="key-color unavailable"></div>
                    <span>Unavailable</span>
                </div>
                <div className="key-item">
                    <div className="key-color occupied"></div>
                    <span>Booked by You</span>
                </div>
            </div>
            <div className="booking-grid-container">
                <div className="booking-grid">
                    <div className="time-row">
                        {timeSlots.map((time, index) => (
                            <div key={index} className="time-slot">
                                {time}
                            </div>
                        ))}
                    </div>
                    <div className="availability-row">
                        {timeSlots.map((time, index) => (
                            <div
                                key={index}
                                className={`availability-slot ${
                                    isSlotOccupiedByUser(time) ? 'occupied' : isSlotBooked(time) ? 'unavailable' : 'available'
                                }`}
                                onClick={() => handleSlotClick(time)}
                            />
                        ))}
                        {currentTimeOffset !== null && (
                            <div
                                className="current-time-line"
                                style={{ left: `${currentTimeOffset}%` }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;