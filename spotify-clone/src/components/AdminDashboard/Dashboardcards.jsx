import React, { useEffect, useState } from 'react';
import './Dashboardcardstyle.css';
import { LuMusic4 } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { FcLike } from "react-icons/fc";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setmanagelikes,setmanagerusers,setmanagesongs,setdashbardoverview } from '../Store/AdminReducer';

const Dashboardcards = () => {
    const dipatch=useDispatch();
  const [allsongs, setallsongs] = useState([]);
  const [allusers, setallusers] = useState([]);
  const [alllikes, setalllikes] = useState([]);
  const [loading, setloading] = useState(true);
  const usersval=useSelector( (state)=>state.admindata.manageusers );
  const songsval=useSelector( (state)=>state.admindata.managesongs );
  const likesval=useSelector( (state)=>state.admindata.managelikes );

  useEffect(() => {
    const getData = async () => {
      try {
        const [songsRes, usersRes, likesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallusers`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`)
        ]);

        setallsongs(songsRes?.data?.allsongs || []);
        setallusers(usersRes?.data?.allusers || []);
        const onlyLiked = likesRes?.data?.likedetails?.filter(item => item.liked === true) || [];
        setalllikes(onlyLiked);
        setloading(false);
      } catch (err) {
        alert('Error fetching dashboard data');
        setloading(false);
      }
    };

    getData();
  }, []);

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

  if (loading) return <div>Loading...</div>;

  if (!allsongs.length && !allusers.length && !alllikes.length)
    return <div>No data found</div>;

  return (
    <div className='dashboard-cards'>
      <div className='cards-section'>
        <div onClick={handleshowmanagesongs} className='card'>
          <p className='title'><LuMusic4 /> Songs</p>
          <p>{allsongs.length}</p>
        </div>
        <div onClick={handleshowmanageuser} className='card'>
          <p className='title'><LuUsers /> Users</p>
          <p>{allusers.length}</p>
        </div>
        <div onClick={handleshowmanagelikes} className='card'>
          <p className='title'><FcLike /> Likes</p>
          <p>{alllikes.length}</p>
        </div>
      </div>
      <div className='card-details'>
        <p>The Total Songs: {allsongs.length}</p>
        <p>The Total Users: {allusers.length}</p>
        <p>The Total Likes: {alllikes.length}</p>
      </div>
    </div>
  );
};

export default Dashboardcards;