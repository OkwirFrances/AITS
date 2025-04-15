import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import './profile.css';
import edit from '../assets/edit.png';
import { userAPI } from '../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullname: '',
        email: '',
        phone_number: '',
        profile_picture: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userAPI.getUserInfo();
                setUser({
                    fullname: response.fullname || '',
                    email: response.email || '',
                    phone_number: response.phone_number || '',
                    profile_picture: response.profile_picture || null,
                });
            } catch (err) {
                setError('Failed to fetch user data');
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'N/A';
    };

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    if (error) {
        return <div className="profile-container">{error}</div>;
    }

    return (
        <div className='profile-container'>
            <Sidebar />
            <div className='profile-content'>
                <Navbar />
                <h1>Profile</h1>
                <div className='profile-section'></div>
                <div className='profile'>
                    <div className="profile-picture-container">
                        {user.profile_picture ? (
                            <img src={user.profile_picture} alt="Profile" className="profile-picture" />
                        ) : (
                            <div className="profile-initials">
                                {getInitials(user.fullname)}
                            </div>
                        )}
                    </div>
                    <button 
                        className='editbutton'
                        onClick={() => navigate('/editprofilepicture')}
                    >
                        Edit
                        <img src={edit} alt='edit' className='edit' />
                    </button>
                </div>
                <div className='personal-information'>
                    <h1>Personal Information</h1>
                    <label className='name'>Full Name:</label>
                    <h2 className='fullname'>{user.fullname}</h2>
                    <label className='address'>Email Address:</label>
                    <h2 className='address'>{user.email}</h2>
                    {user.phone_number && (
                        <>
                            <label className='phone'>Phone Number:</label>
                            <h2 className='phone-number'>{user.phone_number}</h2>
                        </>
                    )}
                    <button 
                        className='personal-information-editbutton'
                        onClick={() => navigate('/editpersonalinfo')}
                    >
                        Edit
                        <img src={edit} alt='edit' className='edit' />
                    </button>
                </div>
                
                {/* Removed academic information section as it's not provided by the endpoint */}
            </div>
        </div>
    );
};

export default Profile;