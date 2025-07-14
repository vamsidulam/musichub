import React, { useEffect, useState, useRef,useMemo } from 'react';
import './Rightnavstyle.css';
import { RiMenuFold2Line, RiMenuUnfold2Line } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import {
  setrightmenu,
  setisPlaying,
  setcurrentsongid,
  setcurrentsong,
  setautoplay,
  setlikedsongs,setplaylists
} from '../Store/Reducer';
import { FaRegPlayCircle, FaVolumeMute } from "react-icons/fa";
import { PiDotsThreeCircle } from "react-icons/pi";
import { LuCirclePause } from "react-icons/lu";
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import { GoUnmute, GoScreenFull } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserFromToken } from '../../utils/getUserFromToken'

const Rightbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playsong = useRef(null);
  const [showsettingsbaroptions, setshowsettingsbaroptions] = useState(false);
  const [showplaylists, setshowplaylists] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const settingsRef = useRef(null);

  const [songs, setsongs] = useState([]);
  const [selectedsong, setselectedsong] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatsong, setrepeatsong] = useState(false);
  const [isMuted, setisMuted] = useState(false);
  const [hiderightbar, sethiderightbar] = useState(true);
  const playlists = useSelector((state) => state.songdata.playlists);
  const userdetails=getUserFromToken();

  //const useremail = localStorage.getItem('email');
  const useremail=userdetails?.email;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setshowsettingsbaroptions(false);
        setshowplaylists(false);
        setshowcreateplaylist(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  let initialVolume = 0.5;
  try {
    const stored = JSON.parse(localStorage.getItem('songsound'));
    if (typeof stored === 'number' && !isNaN(stored)) {
      initialVolume = stored;
    }
  } catch {
    initialVolume = 0.5;
  }
  const [songsound, setsongsound] = useState(initialVolume);

  
  const autoplay = useSelector(state => state.songdata.autoplay);
  const currentsong = useSelector(state => state.songdata.currentsong);
  const currentsongid = useSelector(state => state.songdata.currentsongid);
  const likedsongs = useSelector(state => state.songdata.likedsongs);
  const isplaying = useSelector(state => state.songdata.isPlaying);
  const isShow = useSelector(state => state.songdata.rightmenu);
  

  //const isLiked = likedsongs.some(song => song.songid === currentsongid);
  const isLiked = useMemo(() => {
        return likedsongs.some(song => String(song.songid) === String(currentsongid));
    }, [likedsongs, currentsongid]);

  
  useEffect(() => {
    const getsongs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`);
        setsongs(response.data.allsongs);
      } catch (err) {
        alert(`Error fetching all songs: ${err}`);
      }
    };
    getsongs();
  }, []);

  
  useEffect(() => {
    if (currentsongid && songs.length > 0) {
      const matchedSong = songs.find(song => String(song._id) === String(currentsongid));
      if (matchedSong) setselectedsong(matchedSong);
    }
  }, [currentsongid, songs]);

  useEffect(() => {
    if (currentsongid && songs.length > 0) {
      const matchedSong = songs.find(song => String(song._id) === String(currentsongid));
      console.log("Matched song from Rightbar:", matchedSong); // Add this
      if (matchedSong) setselectedsong(matchedSong);
    }
  }, [currentsongid, songs]);

  
  useEffect(() => {
    //const email = localStorage.getItem('email');
    const email=userdetails?.email;
    const fetchLikedSongs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`);
        if (response.data.likedetails) {
          const filtered = response.data.likedetails.filter(
            (song) => song.liked === true && song.useremail === email
          );
          dispatch(setlikedsongs(filtered));
        }
      } catch (err) {
        console.error("Error fetching liked songs", err);
      }
    };

    if (email) fetchLikedSongs();
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const isWide = window.innerWidth > 500;
      sethiderightbar(isWide);
      dispatch(setrightmenu(isWide));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (playsong.current) {
      playsong.current.volume = initialVolume;
    }
  }, []);

  useEffect(() => {
    const audio = playsong.current;

    if (autoplay && audio && selectedsong) {
      const tryPlay = () => {
        audio.play()
          .then(() => {
            dispatch(setisPlaying(true));
            dispatch(setautoplay(false));
          })
          .catch(err => console.error("Auto play failed", err));
      };

      audio.addEventListener("canplay", tryPlay);
      audio.load();

      return () => {
        audio.removeEventListener("canplay", tryPlay);
      };
    }
  }, [autoplay, selectedsong, dispatch]);

  const toggleRightbar = (e) => {
    e.preventDefault();
    sethiderightbar(prev => {
      const res = !prev;
      dispatch(setrightmenu(res));
      return res;
    });
  };

  const isSongInPlaylist = (playlist) => playlist.songslist.some(song => String(song.songid) === String(selectedsong._id));

  const handlePlay = async () => {
    if(!userdetails?.email){
      alert("please login to play song");
      return;
    }
    if (!playsong.current || !selectedsong) return;

    if (playsong.current.paused) {
      await playsong.current.play();
      dispatch(setisPlaying(true));
    } else {
      playsong.current.pause();
      dispatch(setisPlaying(false));
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/playsong`, {
        email: useremail,
        songid: currentsongid,
        songname: currentsong,
        playedtime: currentTime
      });
    } catch (err) {
      alert(`Error posting song play data: ${err}`);
    }
  };

  const handleNextButton = () => {
    const currentIndex = songs.findIndex(song => song._id === String(currentsongid));
    if (currentIndex !== -1 && currentIndex < songs.length - 1) {
      const nextSong = songs[currentIndex + 1];
      dispatch(setcurrentsong(nextSong.songname));
      dispatch(setcurrentsongid(nextSong._id));
      dispatch(setisPlaying(true));
      dispatch(setautoplay(true));
      localStorage.setItem('currentsong', nextSong.songname);
      localStorage.setItem('currentsongid', nextSong._id);
    }
  };

  const handlePrevButton = () => {
    const currentIndex = songs.findIndex(song => String(song._id) === String(currentsongid));
    if (currentIndex > 0) {
      const prevSong = songs[currentIndex - 1];
      dispatch(setcurrentsong(prevSong.songname));
      dispatch(setcurrentsongid(prevSong._id));
      dispatch(setisPlaying(true));
      dispatch(setautoplay(true));
      localStorage.setItem('currentsong', prevSong.songname);
      localStorage.setItem('currentsongid', prevSong._id);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    playsong.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleUpdatedTime = () => {
    setCurrentTime(playsong.current.currentTime);
  };

  const handleDuration = () => {
    setDuration(playsong.current.duration);
  };

  const handlesongend = (e) => {
    e.preventDefault();
    if (repeatsong) {
      playsong.current.currentTime = 0;
      playsong.current.play();
    } else {
      handleNextButton();
    }
  };

  const handlerepeatsong = () => {
    setrepeatsong(prev => !prev);
  };

  const handlevolume = (e) => {
    const volumeValue = parseFloat(e.target.value) / 100;
    playsong.current.volume = volumeValue;
    setsongsound(volumeValue);
    localStorage.setItem('songsound', JSON.stringify(volumeValue));
    setisMuted(volumeValue === 0);
  };

  const handleMuteToggle = () => {
    setisMuted(prev => {
      if (!prev) {
        localStorage.setItem('prevVolume', songsound);
        playsong.current.volume = 0;
        setsongsound(0);
        localStorage.setItem('songsound', JSON.stringify(0));
      } else {
        const prevVol = parseFloat(localStorage.getItem('prevVolume')) || 0.5;
        playsong.current.volume = prevVol;
        setsongsound(prevVol);
        localStorage.setItem('songsound', JSON.stringify(prevVol));
        localStorage.removeItem('prevVolume');
      }
      return !prev;
    });
  };

  const addsongtoplaylist = async (playlistid, playlistname) => {
    if(!userdetails?.email){
      alert("please login to continue");return;
    }
    try {
      //const useremail = localStorage.getItem('email');
      const useremail=userdetails?.email;
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addtoplaylist`, {
        playlistid,
        playlistname,
        useremail,
        id:selectedsong._id,
        songname: selectedsong.songname,
        songthumbnail: selectedsong.songthumbnail,
        songurl: selectedsong.songurl,
        language: selectedsong.language,
        singername: selectedsong.singername
      });
      setRefresh(prev => !prev);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${useremail}`);
      dispatch(setplaylists(res.data.allplaylists));
    } catch {
      alert("Error adding song to playlist");
    }
  };

  const [showcreateplaylist,setshowcreateplaylist]=useState(false);
  const [playlistname,setplaylistname]=useState();
  const createplaylist=async()=>{
    //const useremail = localStorage.getItem('email');
    if(!userdetails?.email){
      alert("please login to continue");return;
    }
    const useremail=userdetails?.email;
    try{
      const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/newplaylist`,{
        playlistname,
        useremail
      });
      alert(response.data.msg);
      setshowcreateplaylist(false);
      setplaylistname('');
    }
    catch(err){
      alert(`error occured in creating playlist ${err}`);
      console.log(err);
    }
    const res=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${useremail}`);
    dispatch(setplaylists(res.data.allplaylists));
  }

  const handleinputplaylistname=(event)=>{
    event.preventDefault();
    setplaylistname( event.target.value );
  }

  
  const removeFromPlaylist = async (playlistid) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/removefromplaylist`, {
        playlistid,
        id:selectedsong._id
      });
      setRefresh(prev => !prev);
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${useremail}`);
      dispatch(setplaylists(res.data.allplaylists));
    } catch {
      alert("Error removing song from playlist");
    }
  };

  const handlemaximizebtn = (id) => {
    navigate(`/track/${id}`);
  };
  const handlelike = async (songimg, songid, songname) => {
    if(!userdetails?.email){
      alert("please login to continue");return;
    }
    //const email = localStorage.getItem('email');
    const email=userdetails?.email;
    try {
      const alreadyLiked = likedsongs.some(song => song.songid === String(songid));

      const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/likesong`, {
        email,
        songid: songid.toString(), 
        songname,
        songimg,
        liked: !alreadyLiked
      });
      //lert(response.data.msg);

      // refetch updated liked list
      const response2 = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`);
      if (response2.data.likedetails) {
        const filtered = response2.data.likedetails.filter(
          (song) => song.liked === true && song.useremail === email
        );
        dispatch(setlikedsongs(filtered));
      }
    } catch (err) {
      alert(`Error occurred in liking song`);
    }
  };


  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <>
      {
        isShow ? (
          <RiMenuFold2Line onClick={toggleRightbar} className='right-arrow-btn floating-btn' />
        ) : (
          <div style={{ position: 'fixed' }} className='left-arrow-box'>
            <RiMenuUnfold2Line onClick={toggleRightbar} className='left-arrow-btn floating-btn' />
            <p className='vertical-text'>Mini Player</p>
          </div>
        )
      }

      <div className='right-nav-bar' style={{ display: isShow ? 'block' : 'none' }}>
        {
          isShow && selectedsong  ? (
            <div className='mini-song-ui'>
              <div className='mini-song-ui-details'>
                <p className='mini-song-ui-song-name'>{selectedsong.songname}</p>
                <p className='mini-song-ui-song-lang'>[{selectedsong.language}]</p>
                <GoScreenFull onClick={() => handlemaximizebtn(selectedsong._id)} className='maxmize-btn' />

                  <div className='settings-options' ref={settingsRef}>
                    <PiDotsThreeCircle
                      className='settings-btn'
                      onClick={(e) => {
                        e.stopPropagation();
                        setshowsettingsbaroptions(prev => !prev);
                      }}
                    />

                    {showsettingsbaroptions && (
                      <div style={{
                        backgroundColor:'black',
                        height:'150px',top:'20px',left:'40px',width: '180px'
                      }} className='settings-bar-options'>
                        <div className='add-to-playlist-option'>
                          <p onClick={() => setshowplaylists(prev => !prev)}>Add to playlist</p>

                          {showplaylists && (
                            playlists && playlists.length > 0 ? (
                              <div className='playlist-options'>
                                {playlists.map((item) => {
                                  const inPlaylist = isSongInPlaylist(item);
                                  return (
                                    <p key={item._id}
                                      className='pop'
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        opacity: inPlaylist ? 0.6 : 1
                                      }}
                                      onClick={() => {
                                        inPlaylist
                                          ? removeFromPlaylist(item._id)
                                          : addsongtoplaylist(item._id, item.playlistname);
                                      }}
                                    >
                                      {item.playlistname}
                                      <span style={{ fontSize: '0.9rem' }}>
                                        {inPlaylist ? <span style={{ color: 'lime' }}>✔️ Added</span> : <span style={{ color: '#ccc' }}>➕ Add</span>}
                                      </span>
                                    </p>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className='playlist-options'>
                                <p onClick={() => setshowcreateplaylist(prev => !prev)}>create playlist</p>
                                {
                                  showcreateplaylist && (
                                    <div className='create-new-playlist'>
                                      <input value={playlistname} onChange={handleinputplaylistname} placeholder='Enter playlist name' />
                                      <button onClick={createplaylist}>create</button>
                                    </div>
                                  )
                                }
                              </div>
                            )
                          )}
                        </div>

                        <div>
                          {
                            likedsongs.some(song => String(song.songid) === String(currentsongid))
                              ? <p onClick={() => handlelike(selectedsong.songthumbnail, selectedsong._id, selectedsong.songname)}>Dislike <CiHeart /></p>
                              : <p onClick={() => handlelike(selectedsong.songthumbnail, selectedsong._id, selectedsong.songname)}>Like <FcLike /></p>
                          }
                        </div>
                      </div>
                    )}
                  </div>

                
              </div>

              <div className='mini-song-ui-img'>
                <img src={selectedsong.songthumbnail} alt='no pic found' />
              </div>

              <div className='mini-song-ui-controls-section'>
                <audio
                  ref={playsong}
                  onTimeUpdate={handleUpdatedTime}
                  onLoadedMetadata={handleDuration}
                  onEnded={handlesongend}
                  src={selectedsong.songurl}
                />

                <div className='mini-song-ui-controls-section'>
                  <div className='mini-song-ui-controls'>
                    <RxTrackPrevious className='btn' onClick={handlePrevButton} />
                    {
                      isplaying
                        ? <LuCirclePause className='btn' onClick={handlePlay} />
                        : <FaRegPlayCircle className='btn' onClick={handlePlay} />
                    }
                    <RxTrackNext className='btn' onClick={handleNextButton} />
                  </div>

                  <div className='mini-song-ui-status'>
                    <p className='time-stamp'>{formatTime(currentTime)}</p>
                    <div className='seek-bar-box'>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="seek-slider"
                      />
                    </div>
                    <p className='time-stamp'>{formatTime(duration)}</p>
                  </div>
                </div>

                <div style={{ alignItems: 'center' }} className='mini-song-ui-volume-section'>
                  <div className='mini-song-ui-repeat-btn-box'>
                    {/* {
                      isLiked
                        ? <FcLike onClick={() => handlelike(selectedsong.songthumbnail, selectedsong._id, selectedsong.songname)} className='btn' style={{ fontSize: '23px' }} />
                        : <CiHeart onClick={() => handlelike(selectedsong.songthumbnail, selectedsong._id, selectedsong.songname)} className='btn' style={{ fontSize: '23px' }} />
                    } */}
                    {
                    likedsongs.some(song => String(song.songid) === String(currentsongid))
                        ? <FcLike onClick={() => handlelike(selectedsong.songthumbnail, selectedsong._id, selectedsong.songname)} className='btn' style={{ fontSize: '23px' }} />
                        : <CiHeart onClick={() => handlelike(selectedsong.songthumbnail, selectedsong._id, selectedsong.songname)} className='btn' style={{ fontSize: '23px' }} />
                    }

                  </div>

                  <div className='mini-song-ui-volume-section'>
                    {
                      isMuted
                        ? <FaVolumeMute className='btn' onClick={handleMuteToggle} />
                        : <GoUnmute className='btn' onClick={handleMuteToggle} />
                    }
                    <input
                      type='range'
                      min='0'
                      max='100'
                      onChange={handlevolume}
                      value={songsound * 100}
                    />
                    <p>{Math.round(songsound * 100)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p style={{
              fontSize:'24px',
              paddingTop:'230px',
              textAlign:'center'
            }}>No Song Selected</p>
          )
        }
      </div>
    </>
  );
};

export default Rightbar;
