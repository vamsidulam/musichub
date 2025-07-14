import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recentlyplayedstyle.css';
import { CiPlay1 } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { setcurrentsong, setcurrentsongid, setautoplay } from '../Store/Reducer';
import { useNavigate } from 'react-router-dom';
import { setrightmenu } from '../Store/Reducer';
import { setisPlaying } from '../Store/Reducer';
import { getUserFromToken } from '../../utils/getUserFromToken'

const Recentlyplayed = () => {
  const [recentdata, setrecentdata] = useState([]);
  const [songs, setsongs] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const [useremail,setuseremail]=useState();
  const userdetails=getUserFromToken();
  

  useEffect(() => {
    const getrecentdata = async () => {
      //const email = localStorage.getItem('email');
      const email=userdetails?.email;
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/recentlyplayed?email=${email}`);
        setrecentdata(response.data.recentdata);
        localStorage.setItem('recentlyplayedsongs', JSON.stringify(response.data.recentdata));
      } catch (err) {
        alert(`Error occurred in getting recent data ${err}`);
      }
    };
    //const email=localStorage.getItem('email');
    const email=userdetails?.email;
    if(email)
    {
      getrecentdata();
      setuseremail(email);
    }

  }, []);

  useEffect(() => {
    const getsongs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`);
        setsongs(response.data.allsongs);
      } catch (err) {
        alert(`Error fetching in all songs songs: ${err}`);
      }
    };
    getsongs();
  }, []);
  useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

   const handlesong=async(id,songname)=>{
    if(!userdetails?.email){
      alert("Please login to play song");
      return;
    }
          if(screenWidth<500){
              navigate(`/track/${id}`);
              dispatch(setcurrentsong(songname));
              dispatch(setautoplay(true));
              dispatch(setcurrentsongid(id));
              localStorage.setItem('currentsong', songname);
              localStorage.setItem('currentsongid', id);
              return;
          }
          dispatch(setrightmenu(true));
          dispatch(setisPlaying(true));
          dispatch(setautoplay(true));
          //const useremail=localStorage.getItem('email');
          const useremail=userdetails?.email;
          
          try{
              const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/playsong`,
              {
                  email:useremail,
                  songid:id,
                  songname:songname,
                  playedtime:0
              }
              );
              //alert(response.data.msg);
              dispatch(setcurrentsong(songname));
              dispatch(setcurrentsongid(id));
              localStorage.setItem('currentsong', songname);
              localStorage.setItem('currentsongid', id);
          }
          catch(err){
              alert(`error occured in send play data into db ${err}`);
          }
      }

  return (
    <div style={{
      display:(useremail && recentdata.length>0)?'grid':'none',
    }} className='recently-played'>
      {recentdata && recentdata.length > 0 && (
        <>
          <p className='title'>Recently Played</p>
          {recentdata.map((item, index) => {
            const song = songs.find(s=>s._id===item.songid);
            if (!song) return null;

            return (
              <div className='r-song-box' key={index}>
                <img src={song.songthumbnail} alt='no pic found' />
                <p className='song-name'>{song.songname}</p>
                <CiPlay1 className='play-btn' onClick={() => handlesong(song._id,song.songname)} />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Recentlyplayed;
