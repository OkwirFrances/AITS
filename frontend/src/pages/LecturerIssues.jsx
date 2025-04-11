import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ManagementStyles.css';

const LecturerIssues = () => {
    const { assignedIssues, loading, onResolveIssue } = useOutletContext();

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-content">
            <h1>Assigned Issues</h1>
            
            <div className="management-container">
                <div className="list-section">
                    {assignedIssues.length > 0 ? (
                        <div className="table-container">
                            <table className="management-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Student</th>
                                        <th>Course</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedIssues.map(issue => (
                                        <tr key={issue.id}>
                                            <td>{issue.title}</td>
                                            <td>{issue.student.fullname}</td>
                                            <td>{issue.course?.name || 'N/A'}</td>
                                            <td>{issue.issue_type}</td>
                                            <td>{issue.status}</td>
                                            <td>
                                                {issue.status !== 'resolved' && (
                                                    <button 
                                                        className="resolve-button"
                                                        onClick={() => onResolveIssue(issue.id)}
                                                    >
                                                        Resolve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-data">No issues assigned to you</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LecturerIssues;