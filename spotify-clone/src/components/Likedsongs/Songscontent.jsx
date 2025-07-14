import React from 'react'
import LeftNavbar from '../Homepagebodycomponent/LeftNavbar'
import LeftNavbarsymbol from '../Homepagebodycomponent/LeftNavbarsymbol'
import Rightbar from '../Homepagebodycomponent/Rightbar'
import Likedsongsmiddle from './Likedsongsmiddle'

const Songscontent = () => {
  return (
    <div>
        <div  style={{
        position:'relative',
        top:'100px',
        width: '100%'
        
    }}>
            <LeftNavbar/>
            <LeftNavbarsymbol/>
            <Likedsongsmiddle/>
            <Rightbar/>
        </div>
    </div>
  )
}

export default Songscontent