import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getUserFromToken } from '../../utils/getUserFromToken';
import './Listofplaylistsstyle.css';
import { useDispatch } from 'react-redux';
import { setplaylists,setisPlaying,setcurrentsong,setcurrentsongid,setautoplay,setrightmenu } from '../Store/Reducer';
import { useNavigate } from 'react-router-dom';

const ListofPlaylists = () => {
  const navigate=useNavigate();
  const { id } = useParams();
  const dispatch=useDispatch();
  const user = getUserFromToken(); 
  const isLeftBarShow = useSelector((state) => state.songdata.leftmenu);
  const isRightBarShow = useSelector((state) => state.songdata.rightmenu);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [refresh, setRefresh] = useState(false);

  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [left, setLeft] = useState('320px');
  const [right, setRight] = useState('300px');

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      if (width < 500) {
        setLeft('58px');
        setRight('60px');
      } else {
        setLeft(isLeftBarShow ? '320px' : '85px');
        setRight(isRightBarShow ? '300px' : '60px');
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [isLeftBarShow, isRightBarShow]);

 useEffect(() => {
    const getPlaylist = async () => {
      try {
        if (!user?.email) {
          console.warn("User not found from token");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${user.email}`);
        const allPlaylistsData = response.data.allplaylists;

        const matchedPlaylist = allPlaylistsData.find(p => p._id === id);

        if (matchedPlaylist) {
          setPlaylistDetails(matchedPlaylist);
        } else {
          console.warn("No playlist found with id", id);
        }

      } catch (err) {
        alert(`Error occurred while fetching playlist`);
        console.error(err);
      }
    };

    getPlaylist();
  }, [id, user?.email,refresh]);

  const [durations, setDurations] = useState({}); 

  useEffect(() => {
    if (!playlistDetails) return;

    playlistDetails.songslist.forEach(song => {
      const audio = new Audio(song.songurl);
      audio.addEventListener("loadedmetadata", () => {
        setDurations(prev => ({
          ...prev,
          [song._id]: audio.duration,
        }));
      });
    });
  }, [playlistDetails]);

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return '00:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const removeFromPlaylist = async (songid) => {
    try {
      const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/removefromplaylist`, {
        playlistid:id,
        id:songid
      });
      //alert(response.data.msg);
      setPlaylistDetails(prev => ({
        ...prev,
        songslist: prev.songslist.filter(song => song._id.toString() !== songid.toString())
      }));
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${user.email}`);
      dispatch(setplaylists(res.data.allplaylists));
    } catch {
      alert("Error removing song from playlist");
    }
  };

   const handlesong = async (id, songname) => {
    if(!user?.email){
      alert("please login to continue");return;
    }
    const stringId = id.toString();
    

    if (screenWidth < 500) {
      navigate(`/track/${stringId}`);
      dispatch(setcurrentsong(songname));
      dispatch(setautoplay(true));
      dispatch(setcurrentsongid(stringId));
      localStorage.setItem('currentsong', songname);
      localStorage.setItem('currentsongid', stringId);
      return;
    }

    dispatch(setrightmenu(true));
    dispatch(setisPlaying(true));
    dispatch(setautoplay(true));

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/playsong`, {
        email: user.email,
        songid: stringId,
        songname,
        playedtime: 0
      });

      //alert(response.data.msg);

      dispatch(setcurrentsong(songname));
      dispatch(setcurrentsongid(stringId));
      localStorage.setItem('currentsong', songname);
      localStorage.setItem('currentsongid', stringId);
    } catch (err) {
      alert(`Error occurred in sending play data to DB: ${err}`);
    }
  };


  if (!playlistDetails) {
    return <p style={{ paddingTop: '150px', textAlign: 'center' }}>Loading playlist...</p>;
  }

  return (
    <div className='playlist-page'
      style={{
        position: 'absolute',
        left,
        right,
        top: '110px',
      }}
    >
      <div style={{
            backgroundImage: `url('/songs/trendingsongspic.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} className='playlist-heading'>
        <p>PlaylistName: </p>
        <p>{playlistDetails.playlistname}</p>
      </div>
      <div className='playlist-body'>
        {
          playlistDetails && (
            <div className='list-of-playlists'>
              {
                playlistDetails.songslist && playlistDetails.songslist.map( (song,index)=>{
                  return(
                    <div className='playlist'>
                      <div className='playlist-img'>
                        <img onClick={()=>handlesong(song.songid,song.songname)} src={song.songthumbnail} alt='no pic found' />
                      </div>
                      <div className='playlist-details'>
                        <div className='playlist-song-lang'>
                          <p>{song.songname}</p>
                          <p className='lang'>[{song.language}]</p>
                        </div>
                        <div className='button-duration'>
                          <div className='playlist-remove-btn'>
                            <button onClick={()=>removeFromPlaylist(song._id)}>remove</button>
                          </div>
                          <div className='playlist-song-duration'>
                            <p>{formatDuration(durations[song._id])}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                } )
              }
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ListofPlaylists;