import React from 'react'
import { LuLayoutDashboard } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { BsMusicNoteList } from "react-icons/bs";
import './Adminleftnavbarstyle.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { FcLike } from "react-icons/fc";

import { setdashbardoverview,setmanagerusers,setmanagesongs,setmanagelikes } from '../Store/AdminReducer';

const Adminleftnavbar = () => {
    const dipatch=useDispatch();
    const dashboardval=useSelector( (state)=>state.admindata.dashboardoverview );
    const usersval=useSelector( (state)=>state.admindata.manageusers );
    const songsval=useSelector( (state)=>state.admindata.managesongs );
    const likesval=useSelector( (state)=>state.admindata.managelikes );
    const handleshowdashboardoverview=(event)=>{
        event.preventDefault();
        dipatch(setdashbardoverview(true));
        dipatch(setmanagesongs(false));
        dipatch(setmanagerusers(false));
        dipatch(setmanagelikes(false));
    };
    const handleshowmanageuser=(event)=>{
        event.preventDefault();
        dipatch(setmanagerusers(true));
        dipatch(setdashbardoverview(false));
        dipatch(setmanagesongs(false));
        dipatch(setmanagelikes(false));
    };
    const handleshowmanagesongs=(event)=>{
        event.preventDefault();
        dipatch(setmanagesongs(true));
        dipatch(setdashbardoverview(false));
        dipatch(setmanagerusers(false));
        dipatch(setmanagelikes(false));
    };
    const handleshowmanagelikes=(event)=>{
        event.preventDefault();
        dipatch(setmanagelikes(true));
        dipatch(setmanagesongs(false));
        dipatch(setdashbardoverview(false));
        dipatch(setmanagerusers(false));
        
    };
  return (
    <div className='admin-left-nav-bar'>
        <div className='pictures'>
            <div onClick={handleshowdashboardoverview} className='left-nav-bar-options'>
                <LuLayoutDashboard className='symbol' />
                <p >DashBoard Overview</p>
            </div>
            <div onClick={handleshowmanageuser} className='left-nav-bar-options'>
                <FiUsers className='symbol'/>
                 <p>Manage Users</p>
            </div>
            <div onClick={handleshowmanagesongs} className='left-nav-bar-options'>
                <BsMusicNoteList className='symbol'/>
                <p>Manage Songs</p>
            </div>    
            <div onClick={handleshowmanagelikes} className='left-nav-bar-options'>
                <FcLike className='symbol' />
                <p>Manage Likes</p>
            </div>    
        </div>
    </div>
  )
}

export default Adminleftnavbar