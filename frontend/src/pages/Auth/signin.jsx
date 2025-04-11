// import React, { useState } from 'react';
// import './signin.css';
// import logo from '../../assets/logo.png';
// import mail from '../../assets/mail.png';
// import { useNavigate } from 'react-router-dom';
// import padlock from '../../assets/padlock.png';

// const SignIn = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });

//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSignInClick = async (e) => {
//         e.preventDefault(); 

//         // Validate form data
//         if (!formData.email || !formData.password) {
//             setError('Please fill in all fields.');
//             return;
//         }

//         if (formData.password.length < 8) {
//             setError('Password must be at least 8 characters long.');
//             return;
//         }

//         // Call the backend API for authentication
//         try {
//             const response = await fetch('http://localhost:8000/login/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     email: formData.email,
//                     password: formData.password,
//                 }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // Save the token and role to local storage
//                 localStorage.setItem('authToken', data.token); 
//                 localStorage.setItem('userRole', data.role); 

//                 // Redirect to the appropriate dashboard based on the user's role
//                 switch (data.role) {
//                     case 'lecturer':
//                         navigate('/lecturer/dashboard');
//                         break;
//                     case 'student':
//                         navigate('/student/dashboard');
//                         break;
//                     case 'registrar':
//                         navigate('/registrar/dashboard');
//                         break;
//                     default:
//                         setError('Unknown user role.');
//                         break;
//                 }
//             } else {
//                 // Display error message from the API
//                 setError(data.error || 'Sign-in failed. Please try again.');
//             }
//         } catch (error) {
//             console.error('Sign-in failed:', error);
//             setError('Unable to connect to the server. Please try again later.');
//         }
//     };

//     const isFormValid = formData.email && formData.password.length >= 8;

//     return (
//         <div className='signin-container'>
//             <div className='signin-left'>
//                 <img src={logo} alt='logo' className='muk' />
//                 <h1 className='system-title'>Welcome to the<br /> Academic Issue Tracking System<br />AITS</h1>
//             </div>
//             <div className='signin-right'>
//                 <form className='signin-right-form' onSubmit={handleSignInClick}>
//                     <h2 className='title'>Sign In Into Your Account</h2>
//                     <p className='sub-title'>Please fill in all the fields below</p>
//                     {error && <p className='error-message'>{error}</p>}
//                     <label>
//                         Email Address
//                         <div className='input-container'>
//                             <input
//                                 className='emailaddress'
//                                 type='email'
//                                 name='email'
//                                 placeholder='Enter Your Email Address'
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <img src={mail} alt='mail logo' className='input-icon' />
//                         </div>
//                     </label>
//                     <label>
//                         Password
//                         <div className='input-container'>
//                             <input
//                                 className='pass-word'
//                                 type='password'
//                                 name='password'
//                                 placeholder='Enter Your Password'
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 minLength={8}
//                                 required
//                             />
//                             <img src={padlock} alt='padlock' className='padlock-icon' />
//                         </div>
//                     </label>
//                     <p className='forgot-password'>
//                         <a href='forgot-password' className='forgot-password-link'>Forgot Password?</a>
//                     </p>
//                     <button
//                         className='signinbutton'
//                         type='submit'
//                         disabled={!isFormValid}
//                     >
//                         SIGN IN
//                     </button>
//                     <p className='link'>Don't have an account? <a href='signup' className='signup-link'>Sign Up</a></p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SignIn;

// import React, { useState } from 'react';
// import './signin.css';
// import logo from '../../assets/logo.png';
// import mail from '../../assets/mail.png';
// import { useNavigate } from 'react-router-dom';
// import padlock from '../../assets/padlock.png';
// import { authAPI } from '../../services/api';

// const SignIn = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });

//     const [error, setError] = useState('');

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSignInClick = async (e) => {
//         e.preventDefault(); 

//         if (!formData.email || !formData.password) {
//             setError('Please fill in all fields.');
//             return;
//         }

//         if (formData.password.length < 8) {
//             setError('Password must be at least 8 characters long.');
//             return;
//         }

//         try {
//             const data = await authAPI.login(formData.email, formData.password);
            
//             // Redirect to the appropriate dashboard based on the user's role
//             switch (data.role) {
//                 case 'lecturer':
//                     navigate('/lecturer/dashboard');
//                     break;
//                 case 'student':
//                     navigate('/student/dashboard');
//                     break;
//                 case 'registrar':
//                     navigate('/registrar/dashboard');
//                     break;
//                 default:
//                     setError('Unknown user role.');
//                     break;
//             }
//         } catch (error) {
//             console.error('Sign-in failed:', error);
//             setError(error.message || 'Unable to connect to the server. Please try again later.');
//         }
//     };

//     const isFormValid = formData.email && formData.password.length >= 8;

//     return (
//         <div className='signin-container'>
//             <div className='signin-left'>
//                 <img src={logo} alt='logo' className='muk' />
//                 <h1 className='system-title'>Welcome to the<br /> Academic Issue Tracking System<br />AITS</h1>
//             </div>
//             <div className='signin-right'>
//                 <form className='signin-right-form' onSubmit={handleSignInClick}>
//                     <h2 className='title'>Sign In Into Your Account</h2>
//                     <p className='sub-title'>Please fill in all the fields below</p>
//                     {error && <p className='error-message'>{error}</p>}
//                     <label>
//                         Email Address
//                         <div className='input-container'>
//                             <input
//                                 className='emailaddress'
//                                 type='email'
//                                 name='email'
//                                 placeholder='Enter Your Email Address'
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <img src={mail} alt='mail logo' className='input-icon' />
//                         </div>
//                     </label>
//                     <label>
//                         Password
//                         <div className='input-container'>
//                             <input
//                                 className='pass-word'
//                                 type='password'
//                                 name='password'
//                                 placeholder='Enter Your Password'
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 minLength={8}
//                                 required
//                             />
//                             <img src={padlock} alt='padlock' className='padlock-icon' />
//                         </div>
//                     </label>
//                     <p className='forgot-password'>
//                         <a href='forgot-password' className='forgot-password-link'>Forgot Password?</a>
//                     </p>
//                     <button
//                         className='signinbutton'
//                         type='submit'
//                         disabled={!isFormValid}
//                     >
//                         SIGN IN
//                     </button>
//                     <p className='link'>Don't have an account? <a href='signup' className='signup-link'>Sign Up</a></p>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SignIn;

import React, { useState } from 'react';
import './signin.css';
import logo from '../../assets/logo.png';
import mail from '../../assets/mail.png';
import { useNavigate } from 'react-router-dom';
import padlock from '../../assets/padlock.png';
import { authAPI } from '../../services/api';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignInClick = async (e) => {
        e.preventDefault(); 

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try {
            const data = await authAPI.login(formData.email, formData.password);
            
            // Store user data in localStorage
            localStorage.setItem('authToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userFullname', data.fullname);

            // Redirect to the appropriate dashboard based on the user's role
            switch (data.role) {
                case 'lecturer':
                    navigate('/lecturer/dashboard');
                    break;
                case 'student':
                    navigate('/student/dashboard');
                    break;
                case 'registrar':
                    navigate('/registrar/dashboard');
                    break;
                default:
                    setError('Unknown user role.');
                    break;
            }
        } catch (error) {
            console.error('Sign-in failed:', error);
            setError(error.message || 'Unable to connect to the server. Please try again later.');
        }
    };

    const isFormValid = formData.email && formData.password.length >= 8;

    return (
        <div className='signin-container'>
            <div className='signin-left'>
                <img src={logo} alt='logo' className='muk' />
                <h1 className='system-title'>Welcome to the<br /> Academic Issue Tracking System<br />AITS</h1>
            </div>
            <div className='signin-right'>
                <form className='signin-right-form' onSubmit={handleSignInClick}>
                    <h2 className='title'>Sign In Into Your Account</h2>
                    <p className='sub-title'>Please fill in all the fields below</p>
                    {error && <p className='error-message'>{error}</p>}
                    <label>
                        Email Address
                        <div className='input-container'>
                            <input
                                className='emailaddress'
                                type='email'
                                name='email'
                                placeholder='Enter Your Email Address'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <img src={mail} alt='mail logo' className='input-icon' />
                        </div>
                    </label>
                    <label>
                        Password
                        <div className='input-container'>
                            <input
                                className='pass-word'
                                type='password'
                                name='password'
                                placeholder='Enter Your Password'
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                            <img src={padlock} alt='padlock' className='padlock-icon' />
                        </div>
                    </label>
                    <p className='forgot-password'>
                        <a href='forgot-password' className='forgot-password-link'>Forgot Password?</a>
                    </p>
                    <button
                        className='signinbutton'
                        type='submit'
                        disabled={!isFormValid}
                    >
                        SIGN IN
                    </button>
                    <p className='link'>Don't have an account? <a href='signup' className='signup-link'>Sign Up</a></p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;