import React, { useState } from 'react';
import axios from 'axios';

function Register({ onClose }) {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirmPassword: '', // Added confirmPassword field
        email: '',
        firstname: '',
        surname: '',
        role: 'user',
        genre: '',
        tags: ''
    });
    const [tags, setTags] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        // Include confirmPassword in the fields list
        const fields = ['username', 'password', 'confirmPassword', 'email', 'firstname', 'surname'];
        fields.forEach(field => {
            if (!userData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        // Check if passwords match
        if (userData.password !== userData.confirmPassword) {
            newErrors['confirmPassword'] = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
    
        const submitData = {
            ...userData,
            genre: selectedGenres,
            tags
        };
    
        try {
            await axios.post('http://localhost:5000/register', submitData);
            onClose(); // Close modal on success
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };
    

    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
        if (errors[event.target.name]) {
            setErrors({ ...errors, [event.target.name]: null });
        }
    };

    const handleGenreChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add the genre to the selectedGenres array
            setSelectedGenres([...selectedGenres, value]);
        } else {
            // Remove the genre from the selectedGenres array
            setSelectedGenres(selectedGenres.filter(genre => genre !== value));
        }
    };
    

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            // เพิ่ม tag เข้าไปใน array
            setTags([...tags, value]);
        } else {
            // ลบ tag ออกจาก array
            setTags(tags.filter(tag => tag !== value));
        }
    };

    return (
        <div className="overlay">
            <div className="modal">
                <span className="absolute right-4 top-2 close" onClick={onClose}>×</span>
                <div className='tab'>
                    <button className='active'>
                        สมัครสมาชิก
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='form-container pt-8 pb-8 px-2'>
                    <div className="form-column space-y-5">
                        {/* Username Input */}
                        <div className='input-container'>
                            <input
                                type="text"
                                name="username"
                                placeholder=" "
                                className={`input-field input ${errors.username ? 'error' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="input-label">Username</label>
                        </div>
                        {/* Password Input */}
                        <div className='input-container'>
                            <input
                                type="password"
                                name="password"
                                placeholder=" "
                                className={`input-field input ${errors.password ? 'error' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="input-label">Password</label>
                        </div>
                        {/* Confirm Password Input */}
                        <div className='input-container'>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder=" "
                                className={`input-field input ${errors.confirmPassword ? 'error' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="input-label">Confirm Password</label>
                        </div>
                        {/* Email Input */}
                        <div className='input-container'>
                            <input
                                type="email"
                                name="email"
                                placeholder=" "
                                className={`input-field input ${errors.email ? 'error' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="input-label">Email</label>
                        </div>
                        {/* First Name Input */}
                        <div className='input-container'>
                            <input
                                type="text"
                                name="firstname"
                                placeholder=" "
                                className={`input-field input ${errors.firstname ? 'error' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="input-label">Firstname</label>
                        </div>
                        {/* Last Name Input */}
                        <div className='input-container'>
                            <input
                                type="text"
                                name="surname"
                                placeholder=" "
                                className={`input-field input ${errors.surname ? 'error' : ''}`}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="title" className="input-label">Surname</label>
                        </div>
                    </div>
                    <div className='form-column-spe'>
                        <label>แนวเพลงที่ชอบ:</label>
                        {["ป็อป", "สตริง", "แร็พ", "R&B", "คลาสสิก", "แจ๊ส", "ร็อค", "บลูส์", "อิเล็กทรอนิก"].map((genre, index) => (
                            <div key={index} className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id={`genre-${genre}`}
                                    value={genre}
                                    checked={selectedGenres.includes(genre)}
                                    onChange={handleGenreChange}
                                    className="custom-checkbox"
                                />
                                <label htmlFor={`genre-${genre}`}>{genre}</label>
                            </div>
                        ))}
                    </div>
                    <div className='form-column-spe'>
                        <label>แท็กที่ชอบ:</label>
                        {["T-Pop", "K-Pop", "J-Pop", "สากล", "เพลงรัก", "เพลงเศร้า", "มีความสุข", "ละคร", "การ์ตูน", "ลูกทุ่ง", "เพื่อชีวิต", "สกา/เร็กเก้"].map((tag, index) => (
                            <div key={index} className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id={`tag-${tag}`}
                                    value={tag}
                                    checked={tags.includes(tag)}
                                    onChange={handleTagChange}
                                    className="custom-checkbox"
                                />
                                <label htmlFor={`tag-${tag}`}>{tag}</label>
                            </div>
                        ))}
                    </div>
                    <button className='btn mt-2 absolute right-0 bottom-0' type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
