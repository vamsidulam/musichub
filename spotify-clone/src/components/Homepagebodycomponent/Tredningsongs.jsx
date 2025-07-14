import React,{useState,useEffect} from 'react'
import axios from 'axios';
import './TredingsongStyle.css';
import { useNavigate } from 'react-router-dom';
import { CiPlay1 } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { setrightmenu } from '../Store/Reducer';
import { setisPlaying } from '../Store/Reducer';
import { setcurrentsong,setcurrentsongid } from '../Store/Reducer';
import { setautoplay } from '../Store/Reducer';
import { getUserFromToken } from '../../utils/getUserFromToken'

const Tredningsongs = () => {
    const dispatch=useDispatch();
    const [songsdata,setsongsdata]=useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const navigate=useNavigate();
    const userdetails=getUserFromToken();
    useEffect( ()=>{
        const getsongs=async ()=>{
            try{
                const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getalltrendingsongs`);
                setsongsdata(response.data.alltrendingsongs);
            }
            catch(err){
                alert(`error occured in getting all trending songs ${err}`);
            }
        };
        getsongs();
    } ,[]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const getDisplayedSongs = () => {
        if (!Array.isArray(songsdata)) return []; 
        if (screenWidth < 500) return songsdata.slice(0, 4);
        return songsdata.slice(0, 8);
    };


    const handlesong=async(id,songname)=>{
        if(!userdetails?.email){
            alert("please login to play song");
            return;
        }
        //const useremail=localStorage.getItem('email');
        const useremail=userdetails?.email;
        if(!useremail || useremail==='null' || useremail==='undefined'){
            alert('please login to play song');
            return;
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
        // const useremail=localStorage.getItem('email');
        
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

    const handleseemore=()=>{
        const val="trendingsongs"
        navigate(`/allsongs/${val}`);
    }
   
  return (
    <div className='trending-songs-list'>
        <p className='title'>Trending Songs : </p>
        <p onClick={handleseemore} className='see-more-txt'>see more</p>
        {
            getDisplayedSongs().map((song) => (
                <div className='song-box'>
                    <img  src={song.songthumbnail} alt='no pic found' />
                    <p className='song-name'>{song.songname}</p>
                    <CiPlay1 onClick={()=>handlesong(song._id,song.songname)} className='play-btn' />
                </div>
            ))
        }
    </div>
  )
}

export default Tredningsongs