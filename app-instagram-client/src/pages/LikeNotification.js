import React, {useState} from 'react';
import axios from 'axios';

const LikeNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem('jwtToken')
    const config = {
        headers: {Authorization: `Bearer ${token}`}};

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost/api/notifications/allNotification', config);
            setNotifications(response.data);
            console.log("resp: ", response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost/api/notifications/deleteNotification/${id}`);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }

    return (<>
        <div>
            <h1>Notifications</h1>
            {notifications.map((notification) => (
                <div key={notification.id}>
                    <h3>Notification ID: {notification.id}</h3>
                    <p>Post ID: {notification.post.id}</p>
                    <p>Timestamp: {notification.timestamp}</p>
                    <p>Sender: {notification.sender.name}</p>
                    <p>Receiver: {notification.receiver.name}</p>
                    <button onClick={() => handleDelete(notification.id)}>Delete</button>
                    <hr />
                </div>
            ))}
        </div>

    </>);
}

export default LikeNotification;