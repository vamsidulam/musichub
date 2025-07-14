import React, { useState, useEffect } from 'react';
import './Songdatastyle.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Songdata = () => {
  const { songname: rawSongname } = useParams();
  const songname = decodeURIComponent(rawSongname);
  const [selectedsongdetails, setselectedsongdetails] = useState([]);

  useEffect(() => {
    const getsongdetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`);
        const songs = response.data.allsongs;

        const filtered = songs.filter(
          (song) =>
            song.songname.trim().toLowerCase() === songname.trim().toLowerCase()
        );

        console.log("Decoded Param:", songname);
        console.log("Filtered Songs:", filtered);

        setselectedsongdetails(filtered);
      } catch (err) {
        console.error("Error fetching song details", err);
      }
    };

    if (songname) {
      getsongdetails();
    }
  }, [songname]);

  const handleremovesong=async(id,songname)=>{
    const confirm=window.confirm("Are you sure want to remove this song from app");
    if(!confirm) return;
    try{
      const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/removesongfromapp`,{
        id,songname
      });
      alert(response.data.msg);
    }
    catch(err){
      alert(`error occured in removing song ${err}`);
      console.log(err);
    }
  };

  return (
    <div className='song-data'>
      {selectedsongdetails.length > 0 ? (
        <div>
          {selectedsongdetails.map((song, index) => (
            <div className='song-details-box' key={index}>
                <div className='selected-song-img'>
                    <img src={song.songthumbnail} alt='no pic found' />
                </div>
                <div className='selected-song-details'>
                    <div>
                        <p>Song Name: {song.songname}</p>
                        <p>Singer: {song.singername}</p>
                        <p>Language: {song.language}</p>
                    </div>
                    <div className='remove-btn-section'>
                        <button onClick={()=>handleremovesong(song._id,song.songname)}>Remove from app</button>
                    </div>
                </div>
              
            </div>
          ))}
        </div>
      ) : (
        <p>Loading or no matching song found</p>
      )}
    </div>
  );
};

export default Songdata;
