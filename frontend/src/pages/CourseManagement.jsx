
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ManagementStyles.css';
import { courseAPI, departmentAPI, userAPI} from '../services/api';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department_id: ''  // Changed from 'department' to match model
    });
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAccess = async () => {
            try {
                const userInfo = await userAPI.getUserInfo();
                if (userInfo.role !== 'registrar') {
                    toast.error('Unauthorized access');
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Role verification failed:', error);
            }
        };

        verifyAccess();
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesData, departmentsData] = await Promise.all([
                courseAPI.getCourses(),
                departmentAPI.getDepartments()
            ]);
            setCourses(coursesData);
            setDepartments(departmentsData);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch data');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data according to your model
            const courseData = {
                name: formData.name,
                code: formData.code,
                department: formData.department_id  // Changed to match model's ForeignKey field
            };
            
            await courseAPI.createCourse(courseData);
            toast.success('Course created successfully');
            setFormData({ name: '', code: '', department_id: '' });
            await fetchData();
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error(error.response?.data?.message || 
                       error.message || 
                       'Failed to create course. Please check your inputs.');
        }
    };

    const handleDelete = async (courseId) => {
        try {
            await courseAPI.deleteCourse(courseId);
            toast.success('Course deleted successfully');
            await fetchData();
        } catch (error) {
            toast.error(error.message || 'Failed to delete course');
        }
    };

    if (loading) return <div className="loading">Loading courses...</div>;

    return (
        <div className="dashboard-content">
            <h1>Course Management</h1>
            
            <div className="management-container">
                <div className="form-section">
                    <h2>Create New Course</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Course Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="E.g. Data Structures"
                            />
                        </div>
                        <div className="form-group">
                            <label>Course Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                placeholder="E.g. CS201"
                            />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <select
                                name="department_id"  // Changed to match state
                                value={formData.department_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="submit-button">
                            Create Course
                        </button>
                    </form>
                </div>

                <div className="list-section">
                    <h2>Existing Courses</h2>
                    {courses.length > 0 ? (
                        <div className="table-container">
                            <table className="management-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Department</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map(course => (
                                        <tr key={course.id}>
                                            <td>{course.name}</td>
                                            <td>{course.code}</td>
                                            <td>{course.department?.name || 'N/A'}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDelete(course.id)}
                                                    className="delete-button"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-data">No courses found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseManagement;