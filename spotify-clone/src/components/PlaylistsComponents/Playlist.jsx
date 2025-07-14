import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import Playlistbody from './Playlistbody'
import ListofPlaylists from './ListofPlaylists'

const Playlist = () => {
  return (
    <div style={{
      position:'relative'
    }}>
        <Navbar/>
        <Playlistbody/>
        <ListofPlaylists/>
    </div>
  )
}

export default Playlist