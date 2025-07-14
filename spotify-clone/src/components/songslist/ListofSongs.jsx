import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import './listofsongs.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoPlayCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setrightmenu } from '../Store/Reducer';
import { setisPlaying } from '../Store/Reducer';
import { setcurrentsong, setcurrentsongid, setautoplay } from '../Store/Reducer';
import { getUserFromToken } from '../../utils/getUserFromToken'

const ListofSongs = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
    const isleftbarshow = useSelector((state) => state.songdata.leftmenu);
    const isrightbarshow = useSelector((state) => state.songdata.rightmenu);
    const [left, setLeft] = useState('320px');
    const [right,setright]=useState('300px');
    const [singersdata,setsingersdata]=useState([]);
    const [songDurations, setSongDurations] = useState({});
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const userdetails=getUserFromToken();
    

    const params=useParams();
    const {id}=useParams();
    useEffect(() => {
  if (!singersdata.songslist) return;

  singersdata.songslist.forEach((song) => {
    const audio = new Audio(song.songurl);

    audio.addEventListener('loadedmetadata', () => {
        const durationInSeconds = audio.duration;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        setSongDurations((prev) => ({
          ...prev,
          [song.songid]: formattedDuration,
        }));
      });
      audio.addEventListener('error', () => {
        setSongDurations((prev) => ({
          ...prev,
          [song.songid]: 'Error',
        }));
      });
    });
  }, [singersdata]);

    useEffect( ()=>{
      const getsingersdata=async()=>{
        try{
          // const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsingers`);
          // // setsingersdata(response.data.allsingers[id]);
          // const singer = response.data.allsingers.find(
          //   s => String(s._id) === String(id)
          // );
          // if (singer) {
          //   setsingersdata(singer);
          // } else {
          //   alert("Singer not found");
          // }
           const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getsinger/${id}`);
           setsingersdata(response.data.singer);
        }
        catch{
          alert(`Error occured in fetching singers data`);
        }
      }
      getsingersdata();
    },[] );
    
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

    useEffect(() => {
          const handleResize = () => setScreenWidth(window.innerWidth);
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
      }, []);
      
  const handlesong = async (id, songname) => {
    if(!userdetails?.email){
      alert("please login to continue");return;
    }
    const stringId = id.toString();
    //const useremail = localStorage.getItem('email');
    const useremail=userdetails?.email;

    if (screenWidth < 500) {
      navigate(`/track/${stringId}`);
      dispatch(setcurrentsong(songname));
      dispatch(setautoplay(true));
      dispatch(setcurrentsongid(stringId));
      localStorage.setItem('currentsong', songname);
      localStorage.setItem('currentsongid', stringId);
      return;
    }

    dispatch(setrightmenu(true));
    dispatch(setisPlaying(true));
    dispatch(setautoplay(true));

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/playsong`, {
        email: useremail,
        songid: stringId,
        songname,
        playedtime: 0
      });

      //alert(response.data.msg);

      dispatch(setcurrentsong(songname));
      dispatch(setcurrentsongid(stringId));
      localStorage.setItem('currentsong', songname);
      localStorage.setItem('currentsongid', stringId);
    } catch (err) {
      alert(`Error occurred in sending play data to DB: ${err}`);
    }
  };

    

  return (
    <div
      className="list-of-songs"
      style={{
        position: 'absolute',
        left,
        right,
        top: '11px',
        display: 'flex',
        flexDirection: 'column',
        color: 'black',
        height: '86.3vh',
        overflowY: 'auto'
      }}
    >
      {singersdata && singersdata.songslist ? (
        <div className='song-list-box'>
          <div style={{
            backgroundImage: `url(${encodeURI(singersdata.singerimg)})`,
             backgroundSize: 'cover', 
              backgroundRepeat: 'no-repeat',  
              backgroundPosition: 'center',
          }} className='top song-bg-container'>
            <div className='singerimg'>
              <img src={singersdata.singerimg} alt='no pic found' /> 
            </div>
            <div className='singerdesc'>
              <p>{singersdata.singername}</p>
              <p>Singer,Music Composer,Artist</p>
            </div>
              
              
            
          </div>
          <div className='bottom'>
            {
              singersdata.songslist && singersdata.songslist.map( (song,index)=>{
                return(
                  <div className='songs'>
                    <div className='songimg'>
                      <img onClick={() => handlesong(song.songid,song.songname)} src={song.songthumbnail} alt='no pic found' />
                    </div>
                    <div className='song-desc'>
                      <div className='song-name-lang'>
                        <p onClick={() => handlesong(song.songid,song.songname)} >{song.songname}</p>
                        <p className='song-lang'>[{song.language}]</p>
                      </div>
                      <div className='song-play-btn'>
                        <p className='duration'>{songDurations[song.songid] || '...'}</p>
                        <IoPlayCircleOutline  onClick={() => handlesong(song.songid,song.songname)} />
                      </div>
                    </div>
                  </div>
                )
              } )
            }
          </div>
        </div>
      ) : (
        <div>Loading singer...</div>
      )}
    </div>

  )
}

export default ListofSongs