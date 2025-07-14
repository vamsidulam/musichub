import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './Likedsongsstyle.css';
import {
  setisPlaying,
  setcurrentsong,
  setcurrentsongid,
  setautoplay,
  setrightmenu,
  setlikedsongs
} from '../Store/Reducer';
import { IoPlayCircleOutline } from "react-icons/io5";
import { getUserFromToken } from '../../utils/getUserFromToken'

const Likedsongsmiddle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [songsdata, setsongsdata] = useState([]);
  const [songDurations, setSongDurations] = useState({});
  const [left, setLeft] = useState('320px');
  const [right, setRight] = useState('300px');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isleftbarshow = useSelector((state) => state.songdata.leftmenu);
  const isrightbarshow = useSelector((state) => state.songdata.rightmenu);
  const likedsongs = useSelector((state) => state.songdata.likedsongs);
  const userdetails=getUserFromToken();

  useEffect(() => {
    //const email = localStorage.getItem('email');
    const email=userdetails?.email;

    const fetchLikedSongs = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`);
      if (res.data.likedetails) {
        const liked = res.data.likedetails.filter(
          song => song.liked === true && song.useremail === email
        );
        dispatch(setlikedsongs(liked));
        return liked;
      }
      return [];
    };

    const fetchAllSongs = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`);
      return res.data.allsongs;
    };

    const loadData = async () => {
      const val = params.val;
      //const email = localStorage.getItem('email');
      const email=userdetails?.email;

      if (val === "likedsongs" && email) {
        const [allSongs, liked] = await Promise.all([
          fetchAllSongs(),
          fetchLikedSongs()
        ]);
        const matched = liked.map(likedItem =>
          allSongs.find(song => song._id === likedItem.songid)
        ).filter(Boolean);
        setsongsdata(matched);
      }
    };

    loadData();
  }, [params.val, dispatch]);

  useEffect(() => {
    const audio = document.createElement('audio');

    const loadDurations = async () => {
        for (const song of songsdata) {
        audio.src = song.songurl;

        try {
            await new Promise((resolve, reject) => {
            audio.addEventListener('loadedmetadata', function handler() {
                audio.removeEventListener('loadedmetadata', handler);
                resolve();
            });

            audio.addEventListener('error', function errorHandler() {
                audio.removeEventListener('error', errorHandler);
                reject();
            });
            });

            const duration = audio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            setSongDurations(prev => ({
            ...prev,
            [song._id]: formatted
            }));
        } catch (err) {
            setSongDurations(prev => ({
            ...prev,
            [song._id]: 'N/A'
            }));
        }
        }
    };

    if (songsdata.length > 0) {
        loadDurations();
    }
    }, [songsdata]);


  useEffect(() => {
    const updateSideMargins = () => {
      const width = window.innerWidth;
      if (width < 500) {
        setLeft('58px');
        setRight('60px');
      } else {
        setLeft(isleftbarshow ? '320px' : '85px');
        setRight(isrightbarshow ? '300px' : '60px');
      }
    };

    updateSideMargins();
    window.addEventListener('resize', updateSideMargins);
    return () => window.removeEventListener('resize', updateSideMargins);
  }, [isleftbarshow, isrightbarshow]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlesong = async (songid, songname) => {
    if(!userdetails?.email){
      alert("please login to play song");return;
    }
    //const useremail = localStorage.getItem('email');
    const useremail=userdetails?.email;

    if (screenWidth < 500) {
      navigate(`/track/${songid}`);
    } else {
      dispatch(setrightmenu(true));
      dispatch(setisPlaying(true));
    }

    dispatch(setautoplay(true));
    dispatch(setcurrentsong(songname));
    dispatch(setcurrentsongid(songid));
    localStorage.setItem('currentsong', songname);
    localStorage.setItem('currentsongid', songid);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/playsong`, {
        email: useremail,
        songid,
        songname,
        playedtime: 0
      });
      console.log(response.data.msg);
    } catch (err) {
      alert(`Error sending play data: ${err}`);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left,
        right,
        top: '11px',
        display: 'flex',
        flexDirection: 'column',
        color: 'black',
        height: '86.3vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <div className="trending-songs-ui">
        <div
          className="top"
          style={{
            backgroundImage: `url('/songs/trendingsongspic.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <p>Liked Songs</p>
        </div>
        <div className="bottom">
          {songsdata.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No liked songs found</p>
          ) : (
            songsdata.map((song) => (
              <div className="t-song-box" key={song._id}>
                <div className="t-song-img">
                  <img
                    onClick={() => handlesong(song._id, song.songname)}
                    src={song.songthumbnail}
                    alt="no pic found"
                  />
                </div>
                <div className="t-song-details">
                  <div className="t-song-text">
                    <p>{song.songname}</p>
                    <p className="t-song-lang" style={{ paddingLeft: '10px' }}>
                      [{song.language}]
                    </p>
                  </div>
                  <div className="t-song-play-btn">
                    <p style={{ fontSize: '19px' }} className="duration">
                      {songDurations[song._id] || '...'}
                    </p>
                    <IoPlayCircleOutline
                      onClick={() => handlesong(song._id, song.songname)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Likedsongsmiddle;
