import React,{useEffect} from 'react'
import UserProfileLeftNavbar from './UserProfileLeftNavbar'
import UserProfileLeftNavShorts from './UserProfileLeftNavShorts';
import ProfilePagebody from './ProfilePagebody';
import { useDispatch } from 'react-redux';
import { setshowlikes,setshowprofile,setshowplaylists,setshowsettings } from '../Store/Reducer';

export const UserProfilebody = () => {
    const dispatch=useDispatch();
    useEffect( ()=>{
        dispatch(setshowprofile(true));
        dispatch(setshowlikes(false));
        dispatch(setshowplaylists(false));
        dispatch(setshowsettings(false));
    } ,[]);
  return (
    <div style={{
        position:'relative',
        top:'100px',
        width: '100%',
        display:'flex'
    }}>
        <UserProfileLeftNavbar/>
        <ProfilePagebody/>
    </div>
  )
}
