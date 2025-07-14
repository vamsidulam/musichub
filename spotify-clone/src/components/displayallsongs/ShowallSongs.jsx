import React from 'react'
import Navbar from '../navbarcomponent/Navbar'
import SongsDisplaybar from './SongsDisplaybar'

const ShowallSongs = () => {
  return (
      <div style={{
        position:'relative'
      }}>
          <Navbar/>
          <SongsDisplaybar/>
      </div>
    )
}

export default ShowallSongs