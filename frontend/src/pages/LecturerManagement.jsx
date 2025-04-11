

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { lecturerAPI, departmentAPI, courseAPI } from '../services/api';
// import './ManagementStyles.css';

// const LecturerManagement = () => {
//     const [loading, setLoading] = useState(true);
//     const [lecturers, setLecturers] = useState([]);
//     const [courses, setCourses] = useState([]);
//     const [selectedLecturer, setSelectedLecturer] = useState('');
//     const [selectedCourses, setSelectedCourses] = useState([]);

//     // Fetch initial data
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const [lecturersRes, coursesRes] = await Promise.all([
//                     lecturerAPI.getLecturers(),
//                     courseAPI.getCourses()
//                 ]);
//                 setLecturers(lecturersRes);
//                 setCourses(coursesRes);
//             } catch (error) {
//                 toast.error(error || 'Failed to load data');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     const handleLecturerSelect = (e) => {
//         setSelectedLecturer(e.target.value);
//     };

//     const handleCourseSelect = (e) => {
//         const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
//         setSelectedCourses(selectedOptions);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!selectedLecturer) {
//             toast.error('Please select a lecturer');
//             return;
//         }

//         try {
//             setLoading(true);
//             // Update lecturer's courses
//             const lecturerToUpdate = lecturers.find(l => l.id === selectedLecturer);
//             const updatedLecturer = await lecturerAPI.updateLecturer(selectedLecturer, {
//                 ...lecturerToUpdate,
//                 courses: selectedCourses
//             });
            
//             // Update local state
//             setLecturers(lecturers.map(lecturer => 
//                 lecturer.id === selectedLecturer ? updatedLecturer : lecturer
//             ));
            
//             toast.success('Lecturer courses updated successfully');
//             setSelectedCourses([]);
//         } catch (error) {
//             toast.error(error || 'Failed to update lecturer courses');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="loading">Loading...</div>;

//     return (
//         <div className="dashboard-content">
//             <h1>Lecturer Management</h1>
            
//             <div className="management-container">
//                 <div className="form-section">
//                     <h2>Enroll Lecturer to Courses</h2>
//                     <form onSubmit={handleSubmit}>
//                         <div className="form-group">
//                             <label>Select Lecturer</label>
//                             <select
//                                 name="lecturer"
//                                 value={selectedLecturer}
//                                 onChange={handleLecturerSelect}
//                                 required
//                             >
//                                 <option value="">Select Lecturer</option>
//                                 {lecturers.map(lecturer => (
//                                     <option key={lecturer.id} value={lecturer.id}>
//                                         {lecturer.fullname} ({lecturer.email})
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group">
//                             <label>Select Courses</label>
//                             <select
//                                 name="courses"
//                                 multiple
//                                 value={selectedCourses}
//                                 onChange={handleCourseSelect}
//                                 required
//                             >
//                                 {courses.map(course => (
//                                     <option key={`course-${course.id}`} value={course.id}>
//                                         {course.name}
//                                     </option>
//                                 ))}
//                             </select>
//                             <small>Hold Ctrl/Cmd to select multiple courses</small>
//                         </div>
//                         <button type="submit" className="submit-button">
//                             Enroll Lecturer
//                         </button>
//                     </form>
//                 </div>

//                 <div className="list-section">
//                     <h2>Lecturers and Their Courses</h2>
//                     {lecturers.length > 0 ? (
//                         <div className="table-container">
//                             <table className="management-table">
//                                 <thead>
//                                     <tr>
//                                         <th>Name</th>
//                                         <th>Email</th>
//                                         <th>Courses</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {lecturers.map(lecturer => (
//                                         <tr key={`lecturer-${lecturer.id}`}>
//                                             <td>{lecturer.fullname}</td>
//                                             <td>{lecturer.email}</td>
//                                             <td>
//                                                 {lecturer.courses?.length > 0 ? (
//                                                     <ul>
//                                                         {lecturer.courses.map(courseId => {
//                                                             const course = courses.find(c => c.id === courseId);
//                                                             return <li key={`${lecturer.id}-${courseId}`}>{course?.name || 'Unknown Course'}</li>;
//                                                         })}
//                                                     </ul>
//                                                 ) : 'No courses assigned'}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <p className="no-data">No lecturers found</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LecturerManagement;

import React, { useEffect, useState } from 'react';
import { lecturerAPI, courseAPI } from '../services/api';
import './ManagementStyles.css';

function LecturerManagement() {
    const [lecturers, setLecturers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLecturers();
        fetchCourses();
    }, []);

    const fetchLecturers = async () => {
        try {
            const data = await lecturerAPI.getLecturers();
            console.log("Fetched Lecturers:", data);
            setLecturers(data);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const data = await courseAPI.getCourses();
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleLecturerChange = (event) => {
        const lecturerId = event.target.value;
        setSelectedLecturer(lecturerId);
    };

    const handleCourseChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedCourses(selectedOptions);
    };

    const updateLecturerCourses = async () => {
        if (!selectedLecturer || selectedCourses.length === 0) {
            alert('Please select a lecturer and at least one course.');
            return;
        }
        setLoading(true);
        try {
            await lecturerAPI.updateLecturer(selectedLecturer, { courses: selectedCourses });
            alert('Lecturer courses updated successfully');
        } catch (error) {
            console.error('Error updating lecturer courses:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Lecturer Management</h1>
            <label>Select Lecturer:</label>
            <select onChange={handleLecturerChange}>
                <option value="">--Select Lecturer--</option>
                {lecturers.map(lecturer => (
                    <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>
                ))}
            </select>
            
            <label>Select Courses:</label>
            <select multiple onChange={handleCourseChange}>
                {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                ))}
            </select>
            
            <button onClick={updateLecturerCourses} disabled={loading}>
                {loading ? 'Updating...' : 'Update Lecturer Courses'}
            </button>
        </div>
    );
}

export default LecturerManagement;
