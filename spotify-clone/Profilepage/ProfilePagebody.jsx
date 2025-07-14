import React from 'react'
import { setshowlikes,setshowplaylists,setshowprofile,setshowsettings } from '../Store/Reducer'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Profilepage from './Profilepage';

const ProfilePagebody = () => {
    const dispatch=useDispatch();
    const showprofile=useSelector( (state)=>state.songdata.showprofile );
    const showlikes=useSelector( (state)=>state.songdata.showlikes );
    const showplaylists=useSelector( (state)=>state.songdata.showplaylist );
    const showsettings=useSelector( (state)=>state.songdata.showsettings );
    
  return (
    <div style={{
        position:'absolute',top: '50px',right:'50%',left:'35%'
    }} >
        {
            showprofile &&(
                <Profilepage/>
            )
        }
        {
            showlikes &&(
                <p>hi likes</p>
            )
        }
        {
            showplaylists &&(
                <p>hi playlists</p>
            )
        }
        {
            showsettings &&(
                <p>hi settings</p>
            )
        }
    </div>
  )
}

export default ProfilePagebody