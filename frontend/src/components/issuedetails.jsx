import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { IssuesContext } from '../context/IssueContext';
import './issuedetails.css';

const IssueDetails = () => {
    const { id } = useParams();
    const { issues } = useContext(IssuesContext);
    const issue = issues.find(issue => issue.id === id);

    if (!issue) {
        return <div>Issue not found</div>;
    }

    return (
        <div className='issue-detail-container'>
            <h1>Issue Details</h1>
            <div className='issue-detail'>
                <p><strong>Title:</strong>{issue.title}</p>
                <p><strong>Description:</strong>{issue.description}</p>
                <p><strong>Category:</strong>{issue.category}</p>
                <p><strong>Registrar:</strong>{issue.registrar}</p>
                <p><strong>Lecturer:</strong>{issue.lecturer}</p>
                <p><strong>Course Name:</strong>{issue.coursename}</p>
                <p><strong>Course Code:</strong>{issue.coursecode}</p>
                <p><strong>Status:</strong>{issue.status}</p>
                <p><strong>Date:</strong>{issue.date}</p>
                {issue.attachment && (
                    <div>
                        <strong>Attachment:</strong>
                        <img src={URL.createObjectURL(issue.attachment)} alt='attachment' className='issue-attachment' />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueDetails;