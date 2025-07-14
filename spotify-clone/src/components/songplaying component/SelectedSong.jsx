import React, { useState, useRef, useEffect } from 'react';
import './Selectedsongstyle.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RxTrackNext, RxTrackPrevious } from "react-icons/rx";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaVolumeMute
} from "react-icons/fa";
import { GoUnmute } from "react-icons/go";
import { MdCloseFullscreen } from "react-icons/md";
import { GoScreenFull } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { MdRepeatOn } from "react-icons/md";
import { RiRepeatFill } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import { setisPlaying, setplaylists, setlikedsongs } from '../Store/Reducer';
import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { getUserFromToken } from '../../utils/getUserFromToken'

const SelectedSong = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const playsong = useRef(null);
  const containerRef = useRef(null);
  const settingsRef = useRef(null);

  const isPlaying = useSelector((state) => state.songdata.isPlaying);
  const playlists = useSelector((state) => state.songdata.playlists);
  const likedsongs = useSelector((state) => state.songdata.likedsongs);
  const currentsongid = useSelector((state) => state.songdata.currentsongid);

  const [songs, setSongs] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setisMuted] = useState(false);
  const [repeatsong, setrepeatsong] = useState(false);
  const [autoplay, setautoplay] = useState(false);
  const [showsettingsbaroptions, setshowsettingsbaroptions] = useState(false);
  const [showplaylists, setshowplaylists] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const userdetails=getUserFromToken();

  let initialVolume = 0.5;
  try {
    const stored = JSON.parse(localStorage.getItem('songsound'));
    if (typeof stored === 'number' && !isNaN(stored)) {
      initialVolume = stored;
    }
  } catch (err) {
    initialVolume = 0.5;
  }
  const [songsound, setsongsound] = useState(initialVolume);

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


  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`);
        setSongs(response.data.allsongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        //const useremail = localStorage.getItem('email');
        const useremail=userdetails?.email;
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallplaylists/${useremail}`);
        dispatch(setplaylists(response.data.allplaylists));
      } catch (err) {
        alert(`error occured in fetching all playlists ${err}`);
      }
    };
    fetchPlaylists();
  }, [refresh]);

  const selectedSong = songs.find(song => String(song._id) === String(id));

  useEffect(() => {
    if (!selectedSong || !playsong.current) return;
    playsong.current.pause();
    playsong.current.load();
    setCurrentTime(0);

    if (autoplay) {
      playsong.current.play().catch(err => console.error("Autoplay error:", err));
      dispatch(setisPlaying(true));
      setautoplay(false);
    } else {
      dispatch(setisPlaying(false));
    }
  }, [selectedSong]);

  const handlePlay = async () => {
    if(!userdetails?.email){
      alert("please login to continue");return;
    }
    if (!playsong.current) return;

    //const useremail = localStorage.getItem('email');
    const useremail=userdetails?.email;
    if (!isPlaying) {
      playsong.current.play();
      dispatch(setisPlaying(true));
    } else {
      playsong.current.pause();
      dispatch(setisPlaying(false));
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/playsong`, {
        email: useremail,
        songid: id,
        songname: selectedSong.songname,
        playedtime: currentTime
      });
    } catch (err) {
      alert(`Error updating play data: ${err}`);
    }
  };

  const handleNextButton = () => {
    const index = songs.findIndex(song => String(song._id) === String(id));
    if (index < songs.length - 1) {
      const nextId = songs[index + 1]._id;
      dispatch(setisPlaying(true));
      setautoplay(true);
      navigate(`/track/${nextId}`);
    }
  };

  const handlePrevButton = () => {
    const index = songs.findIndex(song => String(song._id) === String(id));
    if (index > 0) {
      const prevId = songs[index - 1]._id;
      dispatch(setisPlaying(true));
      setautoplay(true);
      navigate(`/track/${prevId}`);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    playsong.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handlerepeatsong = () => setrepeatsong(prev => !prev);
  const handleUpdatedTime = () => setCurrentTime(playsong.current.currentTime);
  const handleDuration = () => setDuration(playsong.current.duration);
  const handlesongend = () => (repeatsong ? (playsong.current.currentTime = 0, playsong.current.play()) : handleNextButton());

  const handleEnterFullscreen = () => containerRef.current?.requestFullscreen();
  const handleExitFullscreen = () => document.exitFullscreen().catch(err => console.error(err));

  const handlevolume = (event) => {
    const volumeValue = parseFloat(event.target.value) / 100;
    playsong.current.volume = volumeValue;
    setsongsound(volumeValue);
    localStorage.setItem('songsound', JSON.stringify(volumeValue));
    setisMuted(volumeValue === 0);
  };

  const handleMuteToggle = () => {
    setisMuted(prev => {
      if (!prev) {
        localStorage.setItem('prevVolume', songsound);
        setsongsound(0);
        playsong.current.volume = 0;
        localStorage.setItem('songsound', JSON.stringify(0));
      } else {
        const prevVol = parseFloat(localStorage.getItem('prevVolume')) || 0.5;
        setsongsound(prevVol);
        playsong.current.volume = prevVol;
        localStorage.setItem('songsound', JSON.stringify(prevVol));
      }
      return !prev;
    });
  };

  const handlelike = async (songimg, songid, songname) => {
    if(!userdetails?.email){
      alert("please login to continue");return;
    }
    //const email = localStorage.getItem('email');
    const email=userdetails?.email;
    try {
      const alreadyLiked = likedsongs.some(song => song.songid === String(songid));
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/likesong`, {
        email,
        songid,
        songname,
        songimg,
        liked: !alreadyLiked
      });

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`);
      const filtered = response.data.likedetails.filter(song => song.liked && song.useremail === email);
      dispatch(setlikedsongs(filtered));
    } catch (err) {
      alert("Error liking song");
    }
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
        id,
        songname: selectedSong.songname,
        songthumbnail: selectedSong.songthumbnail,
        songurl: selectedSong.songurl,
        language: selectedSong.language,
        singername: selectedSong.singername
      });
      setRefresh(prev => !prev);
    } catch {
      alert("Error adding song to playlist");
    }
  };

  const [showcreateplaylist,setshowcreateplaylist]=useState(false);
  const [playlistname,setplaylistname]=useState();
  const createplaylist=async()=>{
    if(!userdetails?.email){
      alert("please login to continue");return;
    }
    //const useremail = localStorage.getItem('email');
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
        id
      });
      setRefresh(prev => !prev);
    } catch {
      alert("Error removing song from playlist");
    }
  };

  

  const isSongInPlaylist = (playlist) => playlist.songslist.some(song => String(song.songid) === String(selectedSong._id));
  const formatTime = (time) => !time || isNaN(time) ? "00:00" : `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

  if (!selectedSong) return <p style={{ color: 'white' }}>Loading...</p>;

  return (
    <div className='song-ui' ref={containerRef}>
      <div className='image-content-box'>
        <div className='song-title'>
          <div className='song-name-lang'>
            <p>{selectedSong.songname}</p>
            <p className='lang'>[{selectedSong.language}]</p>
          </div>
          <div className='song-settings-bar'>
            <div style={{marginTop:'-15px',marginRight:'-30px'}} className='settings-btn-box'>
              <BsThreeDots onClick={(e) => {
                e.stopPropagation();
                setshowsettingsbaroptions(prev => !prev);
              }} className='settings-btn' />
              {
                showsettingsbaroptions && (
                  <div className='settings-bar-options' ref={settingsRef}>
                    <div className='add-to-playlist-option'>
                      <p onClick={() => setshowplaylists(prev => !prev)}>Add to playlist</p>
                      {
                        showplaylists && (
                          playlists && playlists.length > 0 ? (
                            <div className='playlist-options'>
                              {
                                playlists.map((item) => {
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
                                          : addsongtoplaylist(item._id, item.playlistname)
                                      }}
                                    >
                                      {item.playlistname}
                                      <span style={{ fontSize: '0.9rem' }}>
                                        {inPlaylist ? <span style={{ color: 'lime' }}>✔️ Added</span> : <span style={{ color: '#ccc' }}>➕ Add</span>}
                                      </span>
                                    </p>
                                  );
                                })
                              }
                            </div>
                          ) : (
                            <div className='playlist-options'>
                                <p onClick={()=>setshowcreateplaylist( (prev)=>!prev )}>create playlist</p>
                                {
                                  showcreateplaylist && (
                                    <div className='create-new-playlist'>
                                      <input value={playlistname} onChange={handleinputplaylistname} placeholder='Enter playlist name' />
                                      <button onClick={createplaylist} >create</button>
                                    </div>
                                  )
                                }
                                
                            </div>
                          )
                        )
                      }
                    </div>
                    <div>
                      {
                        likedsongs.some(song => String(song.songid) === String(currentsongid))
                          ? <p onClick={() => handlelike(selectedSong.songthumbnail, selectedSong._id, selectedSong.songname)}>Dislike <CiHeart /></p>
                          : <p onClick={() => handlelike(selectedSong.songthumbnail, selectedSong._id, selectedSong.songname)}>Like <FcLike /></p>
                      }
                    </div>
                  </div>
                )
              }
            </div>
            <GoScreenFull className='full-screen-btn' onClick={handleEnterFullscreen} />
            <MdCloseFullscreen className='exit-full-screen-btn' onClick={handleExitFullscreen} />
          </div>
        </div>
        <img className="song-img" src={selectedSong.songthumbnail} alt='No image found' />
      </div>

      <div className='audio-controls'>
        <div className='song-details' style={{ width: '700px' }}>
          <div className='thumbnail'>
            <img src={selectedSong.songthumbnail} alt='thumb' />
          </div>
          <div className='names'>
            <p>{selectedSong.songname}</p>
            <p>{selectedSong.singername}</p>
          </div>
        </div>

        <audio
          ref={playsong}
          onTimeUpdate={handleUpdatedTime}
          onLoadedMetadata={handleDuration}
          onEnded={handlesongend}
          src={selectedSong.songurl}
        />

        <div className='audio-play-pause-controls-btns'>
          <div className='song-controls-section'>
            <div className='song-controls'>
              <RxTrackPrevious onClick={handlePrevButton} className='previous-btn' />
              {
                isPlaying
                  ? <FaPauseCircle className='play-pause-btn' onClick={handlePlay} />
                  : <FaPlayCircle className='play-pause-btn' onClick={handlePlay} />
              }
              <RxTrackNext onClick={handleNextButton} className='next-btn' />
            </div>

            <div className='song-status'>
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

          <div className='song-volume-section'>
            <div className='repeat-btn-box'>
              {
                repeatsong
                  ? <MdRepeatOn onClick={handlerepeatsong} className='repeat-btn' />
                  : <RiRepeatFill onClick={handlerepeatsong} className='repeat-btn' />
              }
            </div>
            <div className='volume-section'>
              {
                isMuted
                  ? <FaVolumeMute onClick={handleMuteToggle} />
                  : <GoUnmute onClick={handleMuteToggle} />
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
    </div>
  );
};

export default SelectedSong;
