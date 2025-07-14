import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Logincomponents/Login';
import Register from './components/Logincomponents/Register';
import ForgetPassword from './components/Logincomponents/ForgetPassword';
import SongPlay from './components/songplaying component/SongPlay';
import Homepage from './components/Homepagebodycomponent/Homepage';
import Songslist from './components/songslist/Songslist';
import { useDispatch } from 'react-redux';
import { setcurrentsong, setcurrentsongid } from './components/Store/Reducer';
import ShowallSongs from './components/displayallsongs/ShowallSongs';
import Likedsongs from './components/Likedsongs/Likedsongs';
import Checkadmin from './components/AdminDashboard/Checkadmin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import SelectedUser from './components/AdminDashboard/SelectedUser';
import SongEdit from './components/AdminDashboard/SongEdit';
import Uploadnewsong from './components/AdminDashboard/Uploadnewsong';
import AddnewSinger from './components/AdminDashboard/AddnewSinger';
import Playlist from './components/PlaylistsComponents/Playlist';
// import UserProfilePage from './components/Profilepage/UserProfilePage';
import Viewallsingers from './components/viewallsingers/Viewallsingers';

const AppContent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // wait before showing UI

  useEffect(() => {
    const storedSong = localStorage.getItem('currentsong');
    const storedId = localStorage.getItem('currentsongid');

    if (storedSong && storedId) {
      dispatch(setcurrentsong(storedSong));
      dispatch(setcurrentsongid(storedId));
    }

    setLoading(false); // now render
  }, [dispatch]);

  if (loading) return null; // or a loader

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/playlists/:id' element={<Playlist/>} />
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgetpassword' element={<ForgetPassword />} />
        <Route path='/track/:id' element={<SongPlay />} />
        <Route path='/songs/:id' element={<Songslist />} />
        <Route path='/allsongs/:val' element={<ShowallSongs/>} />
        <Route path="/likesongs/:val" element={<Likedsongs />} />
        <Route path="/allsingers" element={<Viewallsingers />} />
        {/* <Route path="/myprofilepage" element={<UserProfilePage/>} /> */}
        <Route path='/admindashboard' element={
          <Checkadmin>
            <AdminDashboard/>
          </Checkadmin>
        } />
        <Route path='/users/:email' element={
          <Checkadmin>
            <SelectedUser/>
          </Checkadmin>
        } />
        <Route path='/songedit/:songname' element={
          <Checkadmin>
            <SongEdit/>
          </Checkadmin>
        } />
        <Route path='/uploadnewsong' element={
            <Checkadmin>
              <Uploadnewsong/>
            </Checkadmin>
          } />
           <Route path='/AddnewSingerwithsong' element={
            <Checkadmin>
              <AddnewSinger/>
            </Checkadmin>
          } />
          
      </Routes>
    </BrowserRouter>
  );
};

export default AppContent;
