import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/dashboard.css'; // สร้างและนำเข้าไฟล์ CSS
import { FaMusic, FaUser, FaUserFriends } from 'react-icons/fa'; // ตรวจสอบว่าได้ติดตั้ง react-icons

function DashboardOverview() {
    const [data, setData] = useState({
        total_artists: 0,
        total_songs: 0,
        total_accounts: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/dashboard/overview');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-item">
                <FaMusic className="dashboard-icon" />
                <div>
                    <h3>{data.total_songs}</h3>
                    <p>Total Songs</p>
                </div>
            </div>
            <div className="dashboard-item">
                <FaUserFriends className="dashboard-icon" />
                <div>
                    <h3>{data.total_artists}</h3>
                    <p>Total Artists</p>
                </div>
            </div>
            <div className="dashboard-item">
                <FaUser className="dashboard-icon" />
                <div>
                    <h3>{data.total_accounts}</h3>
                    <p>Total Accounts</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardOverview;
