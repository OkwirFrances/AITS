import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './studentdashboard.css';
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { toast } from 'react-toastify';
import { issueAPI, authAPI } from '../../services/api'; // Adjust import path as needed

const LecturerDashboard = () => {
    const [assignedIssues, setAssignedIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Set user role in localStorage
    useEffect(() => {
        localStorage.setItem('userRole', 'lecturer');
    }, []);

    const fetchAssignedIssues = async () => {
        try {
            setLoading(true);
            const issues = await issueAPI.getLecturerIssues();
            setAssignedIssues(issues);
        } catch (error) {
            if (error === 'Unauthorized') {
                handleLogout();
            } else {
                toast.error(error || 'Failed to fetch issues');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (issueId) => {
        try {
            await issueAPI.resolveIssue(issueId);
            await fetchAssignedIssues();
            toast.success('Issue resolved successfully');
        } catch (error) {
            toast.error(error || 'Resolution failed');
        }
    };

    const handleLogout = () => {
        authAPI.logout(); // Use centralized logout from api.jsx
        navigate('/signin');
    };

    useEffect(() => { 
        fetchAssignedIssues(); 
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar />
            <Sidebar />
            <div className="dashboard-content">
                <Outlet context={{ 
                    assignedIssues,
                    loading,
                    onResolveIssue: handleResolve
                }} />
            </div>
        </div>
    );
};

export default LecturerDashboard;