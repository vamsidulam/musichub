import React, { useState, useEffect } from 'react';
import './Middlebarstyle.css';
import { useSelector } from 'react-redux';
import Tredningsongs from './Tredningsongs';
import Singers from './Singers';
import Recentlyplayed from './Recentlyplayed';

const Middlebar = () => {
  const isleftbarshow = useSelector((state) => state.songdata.leftmenu);
  const isrightbarshow = useSelector((state) => state.songdata.rightmenu);
  const [left, setLeft] = useState('320px');
  const [right,setright]=useState('300px');
  useEffect(() => {
    const updateLeft = () => {
      const width = window.innerWidth;

      if (width < 500) {
        setLeft('58px'); 
        setright('60px');
      } else {
        setLeft(isleftbarshow ? '320px' : '85px');
        setright(isrightbarshow?'300px':'60px');
      }
    };

    updateLeft();
    window.addEventListener('resize', updateLeft);
    return () => window.removeEventListener('resize', updateLeft);
  }, [isleftbarshow,isrightbarshow]);

  return (
    <div
      className="middle-bar"
      style={{
        position:'absolute',
        left,
        right,
        display:'flex',
        flexDirection:'column'
      }}
    >
      <Tredningsongs/>
      <Singers/>
      <Recentlyplayed/>
    </div>
  );
};

export default Middlebar;
