import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './displaysongsmiddlebarstyle.css';
import { setisPlaying } from '../Store/Reducer';
import { setcurrentsong, setcurrentsongid, setautoplay } from '../Store/Reducer';
import { useDispatch } from 'react-redux';
import { setrightmenu } from '../Store/Reducer';
import { IoPlayCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { setlikedsongs } from '../Store/Reducer';
import { getUserFromToken } from '../../utils/getUserFromToken'

const Displaysongsmiddelbar = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const params=useParams();
    const [songsdata,setsongsdata]=useState([]);
    const [name,setname]=useState();
    const [songDurations, setSongDurations] = useState({});
    const isleftbarshow = useSelector((state) => state.songdata.leftmenu);
    const isrightbarshow = useSelector((state) => state.songdata.rightmenu);
    const [left, setLeft] = useState('320px');
    const [right,setright]=useState('300px');
     const [screenWidth, setScreenWidth] = useState(window.innerWidth);
     const likedsongs = useSelector(state => state.songdata.likedsongs);
     const userdetails=getUserFromToken();
    useEffect( ()=>{
        const getsongs=async ()=>{
            try{
                const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getalltrendingsongs`);
                setsongsdata(response.data.alltrendingsongs);
            }
            catch(err){
                alert("error occured in fetching trending songs",err);
            }
        };
        const {val}=params;
        setname(val);
        if(val){
            getsongs();
        }
    } ,[]);
    useEffect(() => {
    if (songsdata.length === 0) return;

    songsdata.forEach((song) => {
        const audio = new Audio(song.songurl);
        
        audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        setSongDurations((prev) => ({
            ...prev,
            [song._id]: formatted,
        }));
        });

        audio.addEventListener('error', () => {
        setSongDurations((prev) => ({
            ...prev,
            [song._id]: 'N/A',
        }));
        });
    });
    }, [songsdata]);

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
    const handlesong=async(id,songname)=>{
        if(!userdetails?.email){
            alert(`please login to play song`);return;
        }
        if(screenWidth<500){
            navigate(`/track/${id}`);
            dispatch(setcurrentsong(songname));
            dispatch(setautoplay(true));
            dispatch(setcurrentsongid(id));
            localStorage.setItem('currentsong', songname);
            localStorage.setItem('currentsongid', id);
            return;
        }
        dispatch(setrightmenu(true));
        dispatch(setisPlaying(true));
        dispatch(setautoplay(true));
        //const useremail=localStorage.getItem('email');
        const useremail=userdetails?.email;
        
        try{
            const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/playsong`,
            {
                email:useremail,
                songid:id,
                songname:songname,
                playedtime:0
            }
            );
            //alert(response.data.msg);
            dispatch(setcurrentsong(songname));
            dispatch(setcurrentsongid(id));
            localStorage.setItem('currentsong', songname);
            localStorage.setItem('currentsongid', id);
        }
        catch(err){
            alert(`error occured in send play data into db ${err}`);
        }
    }
  return (
    <div style={{
        position: 'absolute',
        left,
        right,
        top: '11px',
        display: 'flex',
        flexDirection: 'column',
        color: 'black',
        height: '86.3vh',
        overflowY: 'auto',
        backgroundColor:'white'
      }}>
        {
            name ?(
                <div className='trending-songs-ui'>
                    <div style={{
                        backgroundImage:`url('/songs/trendingsongspic.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }} className='top'>
                        <p>{name}</p>
                    </div>
                    <div className='bottom'>
                        {
                            songsdata.map( (song,index)=>{
                                return (
                                    <div className='t-song-box'>
                                        <div className='t-song-img'>
                                            <img onClick={() => handlesong(song._id,song.songname)} src={song.songthumbnail} alt='no pic found' />
                                        </div>
                                        <div className='t-song-details'>
                                            <div className='t-song-text'>
                                                <p>{song.songname}</p>
                                                <p className='t-song-lang' style={{
                                                    paddingLeft:'10px'
                                                }}>[{song.language}]</p>
                                            </div>
                                            <div className='t-song-play-btn'>
                                                <p style={{
                                                    fontSize:'19px'
                                                }} className='duration'>{songDurations[song._id] || '...'}</p>
                                                 <IoPlayCircleOutline  onClick={() => handlesong(song._id,song.songname)} />
                                            </div>
                                           
                                        </div>
                                    </div>
                                )
                            } )
                        }
                    </div>
                </div>
            ):<p>Loading songs</p>
        }
        
    </div>
  )
}

export default Displaysongsmiddelbar