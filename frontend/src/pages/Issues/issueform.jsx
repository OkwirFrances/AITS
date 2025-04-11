import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './issueform.css';
import upload from '../../assets/upload.png';
import { issueAPI, courseAPI, lecturerAPI } from '../../services/api';

const IssueForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        course: '',
        lecturer: '',
        semester: '',
        attachment: null,
    });
    const navigate = useNavigate();
    const outletContext = useOutletContext() || {};
    const { onRefresh } = outletContext
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState({
        courses: null,
        lecturers: null,
        submit: null
    });
    const fileInputRef = useRef(null);

    // Fetch all courses and lecturers on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError({ courses: null, lecturers: null, submit: null });
            
            try {
                // Fetch all courses
                const coursesResponse = await courseAPI.getCourses();
                setCourses(coursesResponse);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(prev => ({ ...prev, courses: 'Failed to load courses. Please try again.' }));
            }
            
            try {
                // Fetch all lecturers
                const lecturersResponse = await lecturerAPI.getLecturers();
                setLecturers(lecturersResponse);
            } catch (err) {
                console.error('Error fetching lecturers:', err);
                setError(prev => ({ ...prev, lecturers: 'Failed to load lecturers. Please try again.' }));
            }
            
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleFileClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const isFormComplete = () => {
        return formData.title && 
               formData.description && 
               formData.category && 
               formData.course &&
               formData.semester;
        // Making attachment and lecturer optional
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormComplete()) return;

        setSubmitting(true);
        setError({ ...error, submit: null });

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('issue_type', formData.category);
        formDataToSend.append('course', formData.course);
        formDataToSend.append('semester', formData.semester);

        // Optional fields
        if (formData.lecturer) {
            formDataToSend.append('assigned_to', formData.lecturer);
        }
        
        if (formData.attachment) {
            formDataToSend.append('image', formData.attachment);
        }
        
        if (formData.lecturer) {
            formDataToSend.append('lecturer', formData.lecturer);
        }
        
        if (formData.attachment) {
            formDataToSend.append('image', formData.attachment);
        }

        try {
            await issueAPI.createIssue(formDataToSend);

            // Reset form data
            setFormData({
                title: '',
                description: '',
                category: '',
                course: '',
                lecturer: '',
                semester: '',
                attachment: null,
            });
            
            if (onRefresh) {
                await onRefresh();
            }
            // alert('Issue submitted successfully!');
            const userRole = localStorage.getItem('userRole') || 'student';
            navigate(`/${userRole}/dashboard`);
        } catch (err) {
            console.error('Error submitting issue:', err);
            setError(prev => ({ 
                ...prev, 
                submit: 'Failed to submit issue. Please try again.' 
            }));
        } finally {
            setSubmitting(false);
        }
    };

    // Find selected course and lecturer for display purposes
    const selectedCourse = courses.find(course => course.id.toString() === formData.course?.toString());
    const selectedLecturer = lecturers.find(lecturer => lecturer.id.toString() === formData.lecturer?.toString());

    return (
        <div className="issue-form-container">
            <div className="issue-form-header">
                <h1>Create a New Issue</h1>
            </div>
            <div className="issue-form-content">
                {/* Course Selection */}
                <label className="course-label">
                    Course <span className="required">*</span>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="course-select"
                        disabled={loading || submitting}
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.code} - {course.name}
                            </option>
                        ))}
                    </select>
                    {error.courses && <div className="error-message">{error.courses}</div>}
                    {loading && <div className="loading-message">Loading courses...</div>}
                </label>
                
                {/* Semester Selection */}
                <label className="semester-label">
                    Semester <span className="required">*</span>
                    <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="semester-select"
                        disabled={submitting}
                    >
                        <option value="">Select Semester</option>
                        <option value="semester 1">Semester 1</option>
                        <option value="semester 2">Semester 2</option>
                    </select>
                </label>
                
                {/* Lecturer Selection */}
                <label className="lecturer-label">
                    Lecturer (Optional)
                    <select
                        name="lecturer"
                        value={formData.lecturer}
                        onChange={handleChange}
                        className="lecturer-select"
                        disabled={loading || submitting}
                    >
                        <option value="">Select Lecturer</option>
                        {lecturers.map(lecturer => (
                            <option key={lecturer.id} value={lecturer.id}>
                                {lecturer.fullname}
                            </option>
                        ))}
                    </select>
                    {error.lecturers && <div className="error-message">{error.lecturers}</div>}
                    {loading && <div className="loading-message">Loading lecturers...</div>}
                </label>

                {/* Image Upload */}
                <label className="upload-label">
                    Upload Photo (Optional)
                    <div className="upload-section">
                        {formData.attachment ? (
                            <div className="attachment-preview">
                                <img
                                    src={URL.createObjectURL(formData.attachment)}
                                    alt="Selected attachment"
                                    className="selected-image"
                                />
                                <button 
                                    className="remove-attachment"
                                    onClick={() => setFormData({...formData, attachment: null})}
                                    disabled={submitting}
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <img src={upload} alt="upload" className="upload-icon" />
                                <button 
                                    onClick={handleFileClick} 
                                    className="upload-link"
                                    disabled={submitting}
                                >
                                    Upload a file
                                </button>{' '}
                                or drag and drop PNG, JPG
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/png, image/jpeg"
                            name="attachment"
                            onChange={handleChange}
                            disabled={submitting}
                        />
                    </div>
                </label>

                {/* Issue Title */}
                <label className="issue-label">
                    Issue Title <span className="required">*</span>
                    <input
                        className="issue-title-input"
                        type="text"
                        name="title"
                        placeholder="Enter Issue Title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={submitting}
                    />
                </label>

                {/* Issue Category */}
                <label className="issue-label">
                    Issue Category <span className="required">*</span>
                    <select
                        className="issue-select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        <option value="">Select Category</option>
                        <option value="missing_marks">Missing Marks</option>
                        <option value="appeal">Appeal</option>
                        <option value="correction">Correction</option>
                    </select>
                </label>

                {/* Issue Description */}
                <label className="issue-label">
                    Issue Description <span className="required">*</span>
                    <textarea
                        name="description"
                        placeholder="Enter the issue description"
                        className="issue-description-input"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        disabled={submitting}
                    />
                </label>

                {/* Summary Section */}
                {isFormComplete() && (
                    <div className="issue-summary">
                        <h3>Issue Summary</h3>
                        <p><strong>Course:</strong> {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : ''}</p>
                        <p><strong>Semester:</strong> {formData.semester}</p>
                        {formData.lecturer && <p><strong>Lecturer:</strong> {selectedLecturer?.fullname || ''}</p>}
                        <p><strong>Issue Type:</strong> {formData.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                )}

                {/* Error Message */}
                {error.submit && <div className="error-submit">{error.submit}</div>}

                {/* Submit Button */}
                <button
                    className="issue-submit-button"
                    onClick={handleSubmit}
                    disabled={!isFormComplete() || submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Issue'}
                </button>
            </div>
        </div>
    );
};

export default IssueForm;