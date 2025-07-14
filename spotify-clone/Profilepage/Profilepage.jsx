import React, { useState, useEffect } from 'react';
import { getUserFromToken } from '../../utils/getUserFromToken';
import './Profilestyle.css';
import { CgProfile } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import axios from 'axios';

const Profilepage = () => {
  const [user, setUser] = useState(getUserFromToken());
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showNameChange, setShowNameChange] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const togglePasswordChange = () => setShowPasswordChange(prev => !prev);
  const toggleNameChange = () => setShowNameChange(prev => !prev);

  const changeName = async () => {
    if (!user?.email) {
      alert(`Please login to change name`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/changename', {
        email: user.email,
        newname: newName
      });

      alert(response.data.msg);
      const updatedUser = { ...user, name: newName };
      localStorage.setItem('token', JSON.stringify(updatedUser));
      setUser(updatedUser); 
      setShowNameChange(false);
      setNewName('');
    } catch (err) {
      alert(`Error occurred in changing name: ${err}`);
    }
  };
  
  const changepassword=async(e)=>{
    e.preventDefault();
    try{
        const response=await axios.post('http://localhost:4000/rechangepassword',
            {
                email:user?.email,newPassword,confirmPassword,oldPassword
            }
        )
        alert(response.data.msg);
        setShowPasswordChange(false);
    }
    catch(err){
        alert(`Error occurred in changing password: ${err}`);
    }
  }

  return (
    <div className='profile-page-section'>
      <div className='user-details-section'>
        <div className='details-section-left'>
          <div className='details name-details'>
            <p>Name: </p>
            <p>{user?.name || 'No name found'}</p>
            <CiEdit onClick={toggleNameChange} className='edit-name-btn' />
            {showNameChange && (
              <div>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='edit-name-input'
                  placeholder='Enter new name'
                />
                <button onClick={changeName} className='confirm-new-name-btn'>Confirm</button>
              </div>
            )}
          </div>

          <div className='details'>
            <p>Email: </p>
            <p>{user?.email || 'No email found'}</p>
          </div>

          <button onClick={togglePasswordChange}>Change Password</button>

          {showPasswordChange && (
            <div className='password-change-section'>
              <form onSubmit={changepassword}>
                <input
                  value={oldPassword} type='password'
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder='Enter current password'
                />
                <input
                  value={newPassword} type='password'
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                />
                <input
                  value={confirmPassword} type='password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Re-enter new password'
                />
                <input className='confirm-btn' type='submit' value='Confirm' />
              </form>
            </div>
          )}
        </div>

        <div className='details-section-right'>
          <CgProfile className='dp' />
        </div>
      </div>

      <div className='profile-status'>status</div>
    </div>
  );
};

export default Profilepage;
