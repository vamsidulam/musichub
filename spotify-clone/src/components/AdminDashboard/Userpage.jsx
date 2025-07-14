import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './userpagestyle.css';
import { BsPerson } from "react-icons/bs";

const Userpage = () => {
  const { email } = useParams();
  const [selecteduser, setselecteduser] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getallusers = async () => {
      try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${email}`);
            setselecteduser(response.data.user);
        } catch (err) {
            console.error(err);
            setselecteduser(null);
        } finally {
            setloading(false);
        }
    };
    if (email) {
      getallusers();
    }
  }, [email]);

  const handleblock=async()=>{
    try{
        const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/blockuser`,{
            email
        });
        alert(response.data.msg);
        getallusers();
    }
    catch(err){
        alert("error occured in blocking user");
    }
  };
  const handleunblock=async()=>{
    try{
        const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/unblockuser`,{
            email
        });
        alert(response.data.msg);
        getallusers();
    }
    catch(err){
        alert("error occured in unblocking user");
    }
  };
  const getallusers = async () => {
      try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/${email}`);
            setselecteduser(response.data.user);
        } catch (err) {
            console.error(err);
            setselecteduser(null);
        } finally {
            setloading(false);
        }
    };

  return (
    <div className='user-page'>
      {loading ? (
        <p>Loading...</p>
      ) : selecteduser ? (
        <div className='user-card'>
            <div className='left-dp'>
                <BsPerson className='dp'/>
            </div>
            <div className='right-details'>
                <div className='details-top'>
                    <h2>Name: {selecteduser.name}</h2>
                    <p>Email: {selecteduser.email}</p>
                    <p>Role: {selecteduser.role}</p>
                    <p>Status: {selecteduser.blocked?'Blocked':'Active'}</p>
                    <p>Registered On:{new Date(selecteduser.registeredat).toLocaleDateString()}</p>
                </div>
                <div className='details-bottom'>
                    <p>User Id: {selecteduser._id}</p>
                    {
                        selecteduser.blocked?<button onClick={handleunblock}>UnBlock</button>:<button onClick={handleblock}>Block</button>
                    }
                    {/* <button onClick={handleblock}>Block</button> */}
                </div>
            </div>
            
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default Userpage;
