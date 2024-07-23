import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login({ onClose }) {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({ form: '', username: '', password: '' });
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = { username: '', password: '', form: '' };
        if (!credentials.username) {
            newErrors.username = 'กรุณากรอก username';
        }
        if (!credentials.password) {
            newErrors.password = 'กรุณากรอก password';
        }
        setErrors(newErrors);
        return !newErrors.username && !newErrors.password;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }
        try {
            const response = await axios.post('http://localhost:5000/login', credentials);
            if (response.data.role) {
                //การใช้งาน login ที่เก็บ user data รวมถึง id
                login({
                    user_id: response.data.user_id, // ต้องแน่ใจว่าเซิร์ฟเวอร์ส่งค่า id กลับมา
                    role: response.data.role,
                    genre: response.data.genre,
                    tags: response.data.tags
                });
                navigateBasedOnRole(response.data.role);
                onClose();
            }
        } catch (error) {
            console.error(error);
            setErrors({ ...errors, form: 'Username / Password ไม่ถูกต้อง' });
        }
    };

    const navigateBasedOnRole = (role) => {
        if (role === 'admin') {
            navigate('/admin');
        } else if (role === 'user') {
            navigate('/');
        }
    };

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    return (
        <div className="overlay">
            <div className="modal w-[280px] min-h-[210px]">
                <span className="absolute right-4 top-2 close" onClick={onClose}>×</span>
                <div className='tab'>
                    <button className='active'>
                        เข้าสู่ระบบ
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='form-container pt-8 pb-8 px-2'>
                    {errors.form && <div className='text-[16px]' style={{ color: 'red'}}>{errors.form}</div>}
                    <div className='form-column space-y-5'>
                        <div className="input-container">
                            <input 
                                type="text"
                                name="username"
                                placeholder=" "
                                onChange={handleChange}
                                className={`input-field input ${errors.username ? 'error' : ''}`}
                            />
                            <label htmlFor="title" className="input-label">Username</label>
                        </div>
                        {errors.username && <div className='text-[16px]' style={{ color: 'red' }}>{errors.username}</div>}
                        <div className="input-container">
                            <input 
                                type="password"
                                name="password"
                                placeholder=" "
                                onChange={handleChange}
                                className={`input-field input ${errors.password ? 'error' : ''}`}
                            />
                            <label htmlFor="title" className="input-label">Password</label>
                        </div>
                        {errors.password && <div className='text-[16px]' style={{ color: 'red' }}>{errors.password}</div>}
                        <button className='btn mt-2 absolute right-0 bottom-1' type="submit">ยืนยัน</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
