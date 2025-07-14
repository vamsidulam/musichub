import React, { useEffect, useState } from 'react';
import './Leftnavbarstyle.css';
import { useSelector, useDispatch } from 'react-redux';
import { setleftmenu,setautoplay,setcurrentsong,setcurrentsongid,setisPlaying,setrightmenu } from '../Store/Reducer';
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { MdAddCard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { RiPlayListFill, RiMenuFold2Line, RiMenuUnfold2Line } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import axios from 'axios';
import { setlikedsongs,setplaylists } from '../Store/Reducer';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../../utils/getUserFromToken'

const LeftNavbar = () => {
  const navigate=useNavigate();
  const userdetails=getUserFromToken();
  const dispatch = useDispatch();
  const isShow = useSelector((state) => state.songdata.leftmenu);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
  const [user, setUser] = useState();
  const [playlistname, setPlaylistname] = useState('');
  const [showPlaylistInput, setShowPlaylistInput] = useState(false);
  const likedsongs = useSelector(state => state.songdata.likedsongs);
  const currentsongid=localStorage.getItem('currentsongid');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const playlists=useSelector( (state)=>state.songdata.playlists );

  useEffect(() => {
    // const email = localStorage.getItem('email');
    const fetchLikedSongs = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`);
      if (res.data.likedetails) {
        const filtered = res.data.likedetails.filter(
          song => song.liked === true && song.useremail === userdetails?.email
        );
        dispatch(setlikedsongs(filtered));
      }
    };
    const fetchplaylists=async()=>{
      try{
        // const useremail=localStorage.getItem('email');
        const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${userdetails?.email}`);
        // setuserallplaylists(response.data.allplaylists);
        dispatch(setplaylists(response.data.allplaylists));
      }
      catch(err){
        alert(`error occured in fetching all playlists ${err}`);
      }
    }
    if (userdetails?.email) {
      fetchLikedSongs();
      fetchplaylists();
    }
  }, []);


  useEffect(() => {
    //const name = localStorage.getItem('username');
    const name=userdetails?.name;
    if (name) {
      setUser(name);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createplaylist=async()=>{
   // const useremail = localStorage.getItem('email');
   if(!userdetails?.email){
    alert("please login to create playlist");
    return;
   }
    try{
      const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/newplaylist`,{
        playlistname,
        useremail:userdetails?.email
      });
      alert(response.data.msg);
      setShowPlaylistInput(false);
      setPlaylistname('');
    }
    catch(err){
      alert(`error occured in creating playlist ${err}`);
      console.log(err);
    }
    const res=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${userdetails?.email}`);
    dispatch(setplaylists(res.data.allplaylists));
  }

  const handlesong=async(id,songname)=>{
    if(!userdetails?.email){
      alert("Please login to play song");
      return;
    }
          //const useremail=localStorage.getItem('email');
          const useremail=userdetails?.email;
          if(!useremail || useremail==='null' || useremail==='undefined'){
              alert('please login to play song');
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
          // const useremail=localStorage.getItem('email');
          
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


  const togglePlaylistInput = () => {
    setShowPlaylistInput((prev) => !prev);
  };

  const handleHideLeftbar = () => {
    dispatch(setleftmenu(false));
  };

  const handleremovelike=async(songid,songimg,songname)=>{
    const confirm=window.confirm("Are you sure you want to remove this from liked songs list");
    if(!confirm) return;
    const unlike=false;
    try{
      //const email=localStorage.getItem('email');
      const email=userdetails?.email;
      const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/likesong`,{
        email,
        songid,
        songimg,
        songname,
        liked:false
      });
      //alert(response.data.msg);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`);
      if (res.data.likedetails) {
        const filtered = res.data.likedetails.filter(
          song => song.liked === true && song.useremail === email
        );
        dispatch(setlikedsongs(filtered));
      }
    }
    catch(err){
      alert(`error in removing like ${err}`);
    }
  }

  const handleviewmore=()=>{
    let val="likedsongs";
    navigate("/likesongs/likedsongs");
    
  }

  const deleteplaylist=async(id)=>{
    const res=window.confirm("Click ok to confirm Deletion");
    if(!res) return;
    try{
      const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/removeplaylist`,{id});
      alert(response.data.msg);
      const res=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${userdetails?.email}`);
      dispatch(setplaylists(res.data.allplaylists));
    }
    catch(err){
      alert(`error occured in deleting playlist ${err}`);
    }
  }

  const navigateplaylist=(id)=>{
    navigate(`/playlists/${id}`);
  }

  const handleShowLeftbar = () => {
    dispatch(setleftmenu(true));
  };

  return (
    <>
      {!isShow && (
        <div className="symbol-nav-bar">
          <div className="bottom">
            <RiMenuUnfold2Line style={{
                display:'none'
            }}
              className="leftnavbar-left-arrow-btn"
              onClick={handleShowLeftbar}
            />
          </div>
        </div>
      )}
      {isShow && (
        <div  className="left-navbar-container">
          <div className='arrow-btn-box'>
            <RiMenuUnfold2Line 
              onClick={handleHideLeftbar}
              className='leftnavbar-hide-btn'
            />
          </div>

          <div
            className={`left-nav-bar ${isMobile && isShow ? 'mobile-overlay' : ''}`}
          >
            <div className='profile-section'>
              <BsFillFileEarmarkPersonFill />
              <p className='user-name'>{userdetails?.name}</p>
            </div>

            <div className='liked-songs-section'>
              <div className='liked-songs-title'>
                <FcLike />
                <p className='heading'>Liked Songs</p>
                <p onClick={handleviewmore} className='view-text'>view all</p>
              </div>
              <div className='songs-list'>
                {
                  likedsongs && likedsongs.length>0 ?(
                    likedsongs.map((song, index) => (
                      <div   className='song' key={index}>
                        <div className='song-img'>
                          <img style={{cursor:'pointer'}} onClick={()=>handlesong(song.songid,song.songname)} src={song.songimg} alt='no pic found' />
                        </div>
                        <div className='left-song-details'>
                          <p  style={{cursor:'pointer'}} onClick={()=>handlesong(song.songid,song.songname)}>{song.songname}</p>
                          <p onClick={()=>handleremovelike(song.songid,song.songimg,song.songname)} className='remove-btn'>remove</p>
                        </div>
                      </div>
                    ))
                    ):<p>No Liked Songs</p>
                  
                }
                
              </div>
            </div>

            <div className='playlist-section'>
              <div className='heading-section'>
                <RiPlayListFill />
                <p className='heading'>Playlists</p>
                <div className='btn-input-section'>
                  <MdAddCard onClick={togglePlaylistInput} className='add-btn' />
                  <p className='create-playlist-title'>create new playlist</p>
                  {showPlaylistInput && (
                   <div style={{
                    display:'flex',position:'absolute',right:'-10px'
                   }}> <input
                      className='input-playlist'
                      onChange={(e) => setPlaylistname(e.target.value)}
                      
                      value={playlistname}
                      name='playlistname'
                      placeholder='Enter playlist name'
                    /> 
                    <button onClick={createplaylist} >create</button>
                    </div>
                  )}
                </div>
              </div>
              <div className='content-section'>
                {
                  playlists && playlists.length>0 ?(
                    playlists.map( (item,index)=>{
                      return(
                        <div style={{
                          display:'flex',
                          marginLeft:'60px'
                        }}>
                          <p onClick={()=>navigateplaylist(item._id)} style={{cursor:'pointer',marginLeft:'-30px'}} >Playlist : {item.playlistname}</p>
                          <p onClick={()=>deleteplaylist(item._id)} style={{
                            paddingLeft:'20px',color:'red',cursor:'pointer'
                          }} >Delete</p>
                        </div>
                      )
                    } )
                  ):(
                    <p>No Playlists</p>
                  )
                }
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftNavbar;