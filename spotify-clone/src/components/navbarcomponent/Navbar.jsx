import React, { useState, useEffect, useRef } from 'react';
import './NavStyle.css';
import { CiSearch } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  setisPlaying,
  setcurrentsong,
  setcurrentsongid,
  setautoplay,
  setrightmenu
} from '../Store/Reducer';
import { getUserFromToken } from '../../utils/getUserFromToken'

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef();

  const [inputdata, setinputdata] = useState('');
  const [songs, setsongs] = useState([]);
  const [filtereddata, setfiltereddata] = useState([]);
  const [user, setuser] = useState();
  const [role, setrole] = useState();
  const [showprofilepage,setshowprofilelpage]=useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const isleftbarshow = useSelector((state) => state.songdata.leftmenu);
  const isrightbarshow = useSelector((state) => state.songdata.rightmenu);
  const userdetails=getUserFromToken();

  useEffect(() => {
    const getsongs = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`);
      if (response.data) {
        setsongs(response.data.allsongs);
      }
    };
    //const name = localStorage.getItem('username');
    const name=userdetails?.name;
    //const role = localStorage.getItem('role');
    const role=userdetails?.role;
    if (name) {
      setuser(name);
      setrole(role);
      getsongs();
    }
  }, [user]);

  const handleinput = (event) => {
    const value = event.target.value;
    setinputdata(value);
    if (value.trim() === '') {
      setfiltereddata([]);
      return;
    }
    const filtered = songs.filter((song) =>
      song.songname.toLowerCase().includes(value.toLowerCase())
    );
    setfiltereddata(filtered);
  };

  const handlelogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.clear();
    setuser("");
    window.location.reload();
    navigate('/');
  };

  const handlelogo = () => {
    navigate('/');
  };

  const handleshowprofilepagebtn=()=>{
    setshowprofilelpage( (prev)=>!prev );
  }

  const handlesong = async (songid, songname) => {
    if(!userdetails.email){
      alert("please login to continute");return;
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

    // Clear input and dropdown
    setinputdata('');
    setfiltereddata([]);
  };

  // Optional: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setfiltereddata([]);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleadmindashboard=()=>{
    navigate('/admindashboard');
  }

  // const handleuserprofilepage=()=>{
  //   navigate('/myprofilepage');
  // }
  return (
    <div className='nav-bar'>
      <div className='logo-bar'>
        <img onClick={handlelogo} src='/logo.png' alt='no-logo-found' />
      </div>

      <div className='input-bar'>
        <div className='input-box' ref={inputRef}>
          <input
            onChange={handleinput}
            value={inputdata}
            placeholder='Search..'
          />
          <div className='search-icon'>
            <CiSearch className='search-icon-logo' />
          </div>

          {filtereddata.length > 0 && (
            <ul
              className="search-results"
            >
              {filtereddata.map((song) => (
                <li
                  key={song._id}
                  style={{ cursor: 'pointer', padding: '8px 10px' }}
                  onClick={() => handlesong(song._id, song.songname)}
                >
                  {song.songname}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className='profile-bar'>
        {user ? (
          <div className='logged-in-profile'>
            <div className='profile'>
              <CgProfile className='userdp' onClick={handleshowprofilepagebtn}  />
              {
                showprofilepage &&(
                  <div className='nav-profile-page'>
                  {/* <p onClick={handleuserprofilepage} className='option'>My profile</p> */}
                  {
                    role==="admin"&&(
                      <p onClick={handleadmindashboard} className='option'>Admin Dashboard</p>
                    )
                  }
                  <button className='option-logout' onClick={handlelogout}>Logout</button>
                </div>
                )
              }
            </div>
            <button className='logout' onClick={handlelogout}>Logout</button>
          </div>
        ) : (
          <div className="login-signup-buttons">
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>SignUp</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
