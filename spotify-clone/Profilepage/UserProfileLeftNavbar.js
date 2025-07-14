import React,{useState,useEffect} from 'react'
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { RiPlayListFill } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import './Userprofileleftnavstyle.css';
import { IoMenuOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setshowlikes,setshowplaylists,setshowprofile,setshowsettings } from '../Store/Reducer';

const UserProfileLeftNavbar = () => {
    const dispatch=useDispatch();
    const [width,setwidth]=useState();
    const [showoptions,setshowoptions]=useState(true);
    useEffect( ()=>{
        setwidth(window.innerWidth);
    } ,[]);

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            setwidth(newWidth);
            if (newWidth < 500) {
            setshowoptions(false);
            } else {
            setshowoptions(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
        }, []);
    
    const handleshowprofile=()=>{
        dispatch(setshowprofile(true));
        dispatch(setshowlikes(false));
        dispatch(setshowplaylists(false));
        dispatch(setshowsettings(false));
    };
    const handleshowlikes=()=>{
        dispatch(setshowprofile(false));
        dispatch(setshowlikes(true));
        dispatch(setshowplaylists(false));
        dispatch(setshowsettings(false));
    };
    const handleshowplaylists=()=>{
        dispatch(setshowprofile(false));
        dispatch(setshowlikes(false));
        dispatch(setshowplaylists(true));
        dispatch(setshowsettings(false));
    };
    const handleshowsettings=()=>{
        dispatch(setshowprofile(false));
        dispatch(setshowlikes(false));
        dispatch(setshowplaylists(false));
        dispatch(setshowsettings(true));
    };

    const handlemenubutton=()=>{
        setshowoptions( (prev)=>{
            return !prev;
        } )
    }
  return (
    <div style={{
        width:showoptions?'220px':'90px',
    }} className= {width < 500 ? 'overlay' : 'user-profile-page-nav-bar'}  >
        <IoMenuOutline onClick={handlemenubutton} className='menu-option'/>
         <div className='options'>  <div onClick={handleshowprofile} className='icon-box'>
                <CgProfile className='dp' />
                {
                    showoptions && (
                         <p>Profile Section</p>
                    )
                }
                <p className='hover-text'>Profile</p>
            </div>
            <div onClick={handleshowlikes} className='icon-box'>
                <FcLike className='dp'/>
                {
                    showoptions && (
                        <p>Liked Songs</p>
                       
                    )
                }
                 <p className='hover-text'>liked songs</p>
            </div>
            <div onClick={handleshowplaylists} className='icon-box'>
                <RiPlayListFill className='dp'/>
                {
                    showoptions && (
                         <p>view Playlist</p>
                        
                    )
                }
                <p className='hover-text'>view playlist</p>
            </div>
            <div onClick={handleshowsettings} className='icon-box'>
                <IoSettingsOutline className='dp' />
                {
                    showoptions && (
                        <p>Settings</p>
                        
                    )
                }
                <p className='hover-text'>settings</p>
            </div>
        </div>
        </div> 
    
  )
}

export default UserProfileLeftNavbar