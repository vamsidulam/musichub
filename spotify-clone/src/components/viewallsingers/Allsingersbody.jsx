import React from 'react'
import LeftNavbar from '../Homepagebodycomponent/LeftNavbar'
import LeftNavbarsymbol from '../Homepagebodycomponent/LeftNavbarsymbol'
import Rightbar from '../Homepagebodycomponent/Rightbar'
import Singerlistmiddle from './Singerlistmiddle'

const Allsingersbody = () => {
  return (
    <div style={{
        position:'relative',
        top:'100px',
        width: '100%'
        
    }}>
        <LeftNavbar/>
        <LeftNavbarsymbol/>
        <Singerlistmiddle/>
        <Rightbar/>
    </div>
  )
}

export default Allsingersbody