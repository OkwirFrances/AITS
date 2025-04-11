import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ManagementStyles.css';
import { departmentAPI, userAPI} from '../services/api';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        code: ''
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
            const data = await departmentAPI.getDepartments();
            setDepartments(data);
        } catch (error) {
            toast.error(error.message || 'Failed to load departments');
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
            await departmentAPI.createDepartment(formData);
            toast.success('Department created successfully');
            setFormData({ name: '', code: '' });
            await fetchData();
        } catch (error) {
            toast.error(error.message || 'Failed to create department. Please check your inputs.');
        }
    };

    const handleDelete = async (departmentId) => {
        try {
            await departmentAPI.deleteDepartment(departmentId);
            toast.success('Department deleted successfully');
            await fetchData();
        } catch (error) {
            toast.error(error.message || 'Failed to delete department');
        }
    };

    if (loading) return <div className="loading">Loading departments...</div>;

    return (
        <div className="dashboard-content">
            <h1>Department Management</h1>
            
            <div className="management-container">
                <div className="form-section">
                    <h2>Create New Department</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Department Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                minLength={2}
                                maxLength={100}
                                placeholder="E.g. Computer Science"
                            />
                        </div>
                        <div className="form-group">
                            <label>Department Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                minLength={2}
                                maxLength={10}
                                pattern="[A-Za-z0-9]+"
                                title="Alphanumeric characters only"
                                placeholder="E.g. CS"
                                className="uppercase-input"
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            Create Department
                        </button>
                    </form>
                </div>

                <div className="list-section">
                    <h2>Existing Departments</h2>
                    {departments.length > 0 ? (
                        <div className="table-container">
                            <table className="management-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map(dept => (
                                        <tr key={dept.id}>
                                            <td>{dept.name}</td>
                                            <td>{dept.code}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDelete(dept.id)}
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
                        <p className="no-data">No departments found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentManagement;