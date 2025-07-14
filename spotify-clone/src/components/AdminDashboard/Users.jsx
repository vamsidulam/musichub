import axios from 'axios';
import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import './Usersstyle.css'
import Userpage from './Userpage';

const Users = () => {
  const navigate=useNavigate();
  const [allusers,setallusers]=useState([]);
  useEffect( ()=>{
    const getallusers=async()=>{
      try{
        const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallusers`);
        setallusers(response.data.allusers);
      }
      catch(err){
        alert(`error occured in fetching users ${err}`);
      }
    };
    getallusers();
  },[] );
  const handleuser=(useremail)=>{
    navigate(`/users/${useremail}`);
  }
  return (
    <div className='users-page'>
      <p>List of Users</p>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>RegisteredOn</th>
          </tr>
        </thead>
      {
        allusers && allusers.length>0?(
          <tbody>
            {
              allusers.map( (user,index)=>{
                return(
                  <tr>
                    <td>{user._id}</td>
                    <td className='email' onClick={()=>handleuser(user.email)} >{user.email}</td>
                    <td>{user.blocked?'Blocked':'Active'}</td>
                    <td>{user.role}</td>
                    <td>{new Date(user.registeredat).toLocaleDateString()}</td>
                  </tr>
                )
              } )
            }
          </tbody>
        ):
        <div>No Users Found</div>
      }
      </table>
    </div>
  )
}

export default Users