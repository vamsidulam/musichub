import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { CiHeart } from "react-icons/ci";
import { FcLike } from "react-icons/fc";

const HandlingLikes = () => {
    const [likesdetails,setllikesdetails]=useState([]);
    useEffect( ()=>{
        const getlikedetails=async()=>{
            try{
                const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/likeddetails`);
                setllikesdetails(response.data.likedetails);
            }
            catch(err){
                alert(`error occured in getting likeddetails ${err}`);
            }
        }
        getlikedetails();
        
    } ,[]);
  return (
    <div style={{
        height:'68vh',overflowY:'auto'
    }} >
        <h2>Like Details</h2>
        {
            likesdetails &&(
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>User</th>
                            <th>Song Name</th>
                            <th>Status</th>
                            <th>Liked At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            likesdetails.map( (detail,index)=>{
                                return(
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{detail.useremail}</td>
                                        <td>{detail.songname}</td>
                                        <td>{detail.liked?<FcLike />:<CiHeart /> }</td>
                                        <td>{new Date(detail.likedat).toLocaleString()}</td>
                                    </tr>
                                )
                            } )
                        }
                    </tbody>
                </table>
            )
        }
        
    </div>
  )
}

export default HandlingLikes