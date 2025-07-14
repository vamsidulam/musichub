import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Uploadnewsongstyle.css';

const Uploadnewsong = () => {
    const navigate=useNavigate();
  const [songname, setSongname] = useState('');
  const [singername, setSingername] = useState('');
  const [language, setLanguage] = useState('');
  const [songfile, setSongfile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!songname || !singername || !language || !songfile || !thumbnail) {
      setMessage('Please fill in all fields and upload both files.');
      return;
    }

    const formData = new FormData();
    formData.append('songname', songname);
    formData.append('singername', singername);
    formData.append('language', language);
    formData.append('songfile', songfile);
    formData.append('thumbnail', thumbnail);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/uploadnewsong`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(res.data.msg || 'Song uploaded successfully!');
      setSongname('');
      setSingername('');
      setLanguage('');
      setSongfile(null);
      setThumbnail(null);
    //   alert(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Upload failed!');
    // alert(`error occured in posting${err}`);
    }
  };

  const handleuploadnewsinger=()=>{
    navigate('/AddnewSingerwithsong');
  };
  
  return (
    <div className='upload-song-box' style={{ padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <h2>Upload New Song</h2>

        <div className='details-box'>
          <label>Name of the Song:</label>
          <input
            type="text"
            value={songname}
            onChange={(e) => setSongname(e.target.value)}
            placeholder="Enter song name"
          />
        </div>

        <div className='details-box'>
          <label>Singer Name:</label>
          <input
            type="text"
            value={singername}
            onChange={(e) => setSingername(e.target.value)}
            placeholder="Enter singer name"
          />
        </div>

        <div className='details-box'>
          <label>Language:</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Enter song language"
          />
        </div>

        <div className='data-upload-box'>
          <label>Upload Song Audio:</label>
          <input type="file" accept="audio/*" onChange={(e) => setSongfile(e.target.files[0])} />
        </div>

        <div className='data-upload-box'>
          <label>Upload Song Thumbnail:</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
        </div>

        <button  className='upload-btn' type="submit">Upload Song</button>
      </form>

      {message && <p style={{ marginTop: '15px', color: 'blue' }}>{message}</p>}
      <button className='new-singer-btn' onClick={handleuploadnewsinger} >Add New Singer</button>
    </div>
  );
};

export default Uploadnewsong;
