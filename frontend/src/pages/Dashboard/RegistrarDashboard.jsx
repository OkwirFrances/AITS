import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import './studentdashboard.css';
// import './RegistrarDashboard.css'
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { toast } from 'react-toastify';
import { issueAPI, lecturerAPI } from '../../services/api'; // Adjust import path as needed

const RegistrarDashboard = () => {
    const [allIssues, setAllIssues] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Set user role in localStorage
    useEffect(() => {
        localStorage.setItem('userRole', 'registrar');
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [issuesResponse, lecturersResponse] = await Promise.all([
                issueAPI.getIssues(),
                lecturerAPI.getLecturers()
            ]);
            setAllIssues(issuesResponse);
            setLecturers(lecturersResponse);
        } catch (error) {
            if (error === 'Unauthorized') {
                handleLogout();
            } else {
                toast.error(error || 'Failed to fetch data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (issueId, lecturerId) => {
        try {
            await issueAPI.assignIssue(issueId, lecturerId);
            await fetchData(); // Refresh data after assignment
            toast.success('Issue assigned successfully');
        } catch (error) {
            toast.error(error || 'Failed to assign issue');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('refreshToken');
        navigate('/signin');
    };

    useEffect(() => { 
        fetchData(); 
    }, []);

    return (
        <div className="dashboard-container">
            <Navbar />
            <Sidebar />
            <div className="dashboard-content">
                <Outlet context={{
                    allIssues,
                    lecturers,
                    loading,
                    onAssignIssue: handleAssign
                }} />
            </div>
        </div>
    );
};

export default RegistrarDashboard;