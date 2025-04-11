import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
import search from '../../assets/search.png';
import notification from '../../assets/notification.png';
import mail from '../../assets/mail.png';

const Navbar = ({ badgeCount = 0 }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole')?.toLowerCase() || 'user';
  const userFullName = localStorage.getItem('userFullName') || 'User';

  const getInitials = (name) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleNotificationClick = () => {
    navigate(`/${userRole}/notifications`);
  };

  const handleMailClick = () => {
    navigate(`/${userRole}/messages`);
  };

  const handleProfileClick = () => {
    navigate(`/${userRole}/profile`);
  };

  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <img src={logo} alt='muk-logo' className='makerere-logo' />
        <span className='navbar-logo-text'>Academic Issue Tracker</span>
      </div>

      <div className='search-container'>
        <input
          type='text'
          className='search-input'
          placeholder='Search issues, courses...'
        />
        <img src={search} alt='search' className='search-icon' />
      </div>

      <div className='nav-right'>
        <div className='notification-container' onClick={handleNotificationClick}>
          <img src={notification} alt='notification' className='notification-icon' />
          {badgeCount > 0 && <span className='notification-badge'>{badgeCount}</span>}
        </div>
        
        <div className='mail-container' onClick={handleMailClick}>
          <img src={mail} alt='mail' className='mail-icon' />
        </div>
        
        <div className='user-profile' onClick={handleProfileClick}>
          <div className='user-initials'>
            {getInitials(userFullName)}
          </div>
          <div className='user-greeting'>
            Hi, {userFullName.split(' ')[0]}
            <span className='user-role'>({userRole})</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;