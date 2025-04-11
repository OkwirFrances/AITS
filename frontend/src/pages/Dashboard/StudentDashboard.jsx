import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './studentdashboard.css';
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { toast } from 'react-toastify';
import { issueAPI, authAPI } from '../../services/api'; // Adjust import path as needed

const StudentDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Set user role in localStorage
    useEffect(() => {
        localStorage.setItem('userRole', 'student');
    }, []);

    const fetchStudentIssues = async () => {
        try {
            setLoading(true);
            // Use the getStudentIssues API endpoint instead of getIssues
            const response = await issueAPI.getIssues();
            setIssues(response);
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch your issues');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        navigate('/signin');
    };

    useEffect(() => { 
        fetchStudentIssues(); 
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar />
            <Sidebar />
            <div className="dashboard-content">
                <Outlet context={{ 
                    issues,
                    loading,
                    onRefresh: fetchStudentIssues
    
                }} />
            </div>
        </div>
    );
};

export default StudentDashboard;