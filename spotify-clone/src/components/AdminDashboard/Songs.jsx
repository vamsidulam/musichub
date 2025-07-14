import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Songsstyle.css';
import { useNavigate } from 'react-router-dom';

const Songs = () => {
  const navigate = useNavigate();
  const [allsongs, setAllSongs] = useState([]);
  const [trendingSongIds, setTrendingSongIds] = useState(new Set());

  useEffect(() => {
    const getAllSongs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsongs`);
        setAllSongs(res.data.allsongs);
      } catch (err) {
        alert(`Error fetching songs: ${err.message}`);
      }
    };

    const getTrendingSongs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getalltrendingsongs`);
        const ids = new Set(res.data.alltrendingsongs.map(song => song._id));
        setTrendingSongIds(ids);
      } catch (err) {
        console.error('Error fetching trending songs:', err);
      }
    };

    getAllSongs();
    getTrendingSongs();
  }, []);

  const handleAddToTrending = async (songid) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addtotrendingsongs`, { songid });
      alert(res.data.msg);
      setTrendingSongIds(prev => new Set(prev).add(songid));
    } catch (err) {
      alert(`Error adding to trending: ${err.message}`);
    }
  };

  const handleRemoveFromTrending = async (songid) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/removefromtrendingsongs`, { songid });
        alert(res.data.msg);

        setTrendingSongIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(songid);
        return newSet;
        });
    } catch (err) {
        alert(`Error removing from trending: ${err.message}`);
    }
    };


  const handleUploadSong = () => {
    navigate('/uploadnewsong');
  };

  return (
    <div className='all-songs-list'>
      <p className='heading'>All Songs</p>
      <button onClick={handleUploadSong} className='upload-new-song-btn'>Upload New Song</button>
      {allsongs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Song Name</th>
              <th>Singer Name</th>
              <th>Language</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allsongs.map((song, index) => (
              <tr className='song-row' key={song._id}>
                <td onClick={() => navigate(`/songedit/${song.songname}`)} className='list-song-name'>
                  {song.songname}
                </td>
                <td>{song.singername}</td>
                <td>{song.language}</td>
                <td>
                  {!trendingSongIds.has(song._id) ? (
                    <button style={{ color: 'green', fontWeight: 'bold',cursor:'pointer' }}  onClick={() => handleAddToTrending(song._id)}>
                      Add To Trending
                    </button>
                  ) : (
                    <button style={{ color: 'green', fontWeight: 'bold',cursor:'pointer' }} onClick={()=>handleRemoveFromTrending(song._id)} >removetrending</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading songs...</p>
      )}
    </div>
  );
};

export default Songs;
