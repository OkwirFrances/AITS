import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import { issueAPI } from '../api';
import './issuedetails.css';

const IssueDetails = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIssueDetails = async () => {
            try {
                const response = await issueAPI.getIssueDetail(id);
                setIssue(response.data);
            } catch (err) {
                setError('Failed to fetch issue details');
                console.error('Error fetching issue details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssueDetails();
    }, [id]);

    if (loading) {
        return <div className="issue-detail-container">Loading issue details...</div>;
    }

    if (error) {
        return <div className="issue-detail-container">{error}</div>;
    }

    if (!issue) {
        return <div className="issue-detail-container">Issue not found</div>;
    }

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className='issue-detail-container'>
            <h1>Issue Details</h1>
            <div className='issue-detail'>
                <p><strong>Title:</strong> {issue.title}</p>
                <p><strong>Type:</strong> {issue.issue_type}</p>
                <p><strong>Semester:</strong> {issue.semester}</p>
                <p><strong>Status:</strong> {issue.status}</p>
                
                {issue.description && (
                    <p><strong>Description:</strong> {issue.description}</p>
                )}

                {issue.student && (
                    <p><strong>Student:</strong> {issue.student.fullname} ({issue.student.student_id})</p>
                )}

                {issue.course && (
                    <>
                        <p><strong>Course:</strong> {issue.course.name} ({issue.course.code})</p>
                        <p><strong>Department:</strong> {issue.course.department?.name}</p>
                    </>
                )}

                {issue.assigned_to && (
                    <p><strong>Assigned Lecturer:</strong> {issue.assigned_to.fullname} ({issue.assigned_to.staff_id})</p>
                )}

                {issue.assigned_by && (
                    <p><strong>Assigned By:</strong> {issue.assigned_by.fullname} ({issue.assigned_by.staff_id})</p>
                )}

                {issue.assigned_at && (
                    <p><strong>Assigned At:</strong> {formatDate(issue.assigned_at)}</p>
                )}

                {issue.resolved_by && (
                    <p><strong>Resolved By:</strong> {issue.resolved_by.fullname} ({issue.resolved_by.staff_id})</p>
                )}

                {issue.resolved_at && (
                    <p><strong>Resolved At:</strong> {formatDate(issue.resolved_at)}</p>
                )}

                <p><strong>Created At:</strong> {formatDate(issue.created_at)}</p>
                <p><strong>Last Updated:</strong> {formatDate(issue.updated_at)}</p>

                {issue.image && (
                    <div className="issue-image-container">
                        <strong>Attachment:</strong>
                        <img 
                            src={issue.image} 
                            alt="Issue attachment" 
                            className="issue-image"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueDetails;