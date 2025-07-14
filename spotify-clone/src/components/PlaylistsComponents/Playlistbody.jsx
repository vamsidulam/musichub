import React from 'react'
import LeftNavbar from '../Homepagebodycomponent/LeftNavbar'
import Rightbar from '../Homepagebodycomponent/Rightbar';
import LeftNavbarsymbol from '../Homepagebodycomponent/LeftNavbarsymbol';

const Playlistbody = () => {
  return (
    <div  style={{
        position:'relative',
        top:'73px',
        width: '100%'
        
    }}>
        <LeftNavbar/>
        <LeftNavbarsymbol/>
        <Rightbar/>
    </div>
  )
}

export default Playlistbody