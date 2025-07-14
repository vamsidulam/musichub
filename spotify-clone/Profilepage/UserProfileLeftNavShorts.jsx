import React, { useState, useEffect } from 'react';
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { RiPlayListFill } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import { IoSettingsOutline } from "react-icons/io5";
import { RiMenuFold2Line } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import { setleftmenu } from '../Store/Reducer';
import { CgProfile } from "react-icons/cg";
import './UserleftnavbarshortsStyle.css';

const UserProfileLeftNavShorts = () => {
  const isHide = useSelector((state) => state.songdata.leftmenu);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenLeftNavbar = () => {
    dispatch(setleftmenu(true));
  };

  return (
    <div
      className='user-symbol-nav-bar'
      style={{
        display: isHide ? 'none' : 'flex',
        width: isMobile ? '50px' : '80px',
      }}
    >
    <RiMenuFold2Line
        className="leftnavbar-left-arrow-btn"
        onClick={handleOpenLeftNavbar}
        style={{ marginTop: '15px', cursor: 'pointer',position:'absolute' }}
    />
      <div className='top'>
        <div className='icon-box'>
            <CgProfile />
            <p className='hover-text'>Profile</p>
        </div>
        <div className='icon-box'>
            <FcLike />
            <p className='hover-text'>Liked Songs</p>
        </div>
        <div className='icon-box'>
            <RiPlayListFill />
            <p className='hover-text'>view playlist</p>
        </div>
        <div className='icon-box'>
            <IoSettingsOutline />
            <p className='hover-text'>Settings</p>
        </div>
        
        
        
        
      </div>
    </div>
  );
};

export default UserProfileLeftNavShorts