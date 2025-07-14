import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import SelectedSong from './SelectedSong'
import LeftNavbar from '../Homepagebodycomponent/LeftNavbar';

const SongPlay = () => {
  return (
    <div>
        <Navbar/>
        <div>
          <SelectedSong/>
        </div>
        
    </div>
  )
}

export default SongPlay