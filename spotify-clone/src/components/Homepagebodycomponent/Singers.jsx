import React,{useState,useEffect} from 'react'
import axios from 'axios'
import './Singersstyle.css'
import { useNavigate } from 'react-router-dom'

const Singers = () => {
    const navigate=useNavigate();
    const [songsdata,setsongsdata]=useState([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    useEffect( ()=>{
        const getsongs=async ()=>{
            try{
                const response=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getallsingers`);
                setsongsdata(response.data.allsingers);
            }
            catch(err){
                alert(`error occured in getting all singers ${err}`);
            }
        };
        getsongs();
    } ,[]);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlesinger=(id)=>{
        navigate(`/songs/${id}`)
    }

    const handleviewallsingers=()=>{
        navigate('/allsingers');
    }


    const getDisplayedSongs = () => {
        if (!Array.isArray(songsdata)) return []; 
        if (screenWidth < 500) return songsdata.slice(0,10 );
        return songsdata.slice(0, 10);
    };
  return (
    <div style={{
        position:'relative'
    }} className='singers-list'>
        <p className='singer-title'>Singers : </p>
        <p onClick={handleviewallsingers} className='view-all-btn' style={{
            position:'absolute',right:'22px',fontSize:'21px',cursor:'pointer'
        }} >view all</p>
        {
            getDisplayedSongs().map((song,index) => (
                <div key={song._id} className='singer-box'>
                    <img onClick={()=>handlesinger(song._id)} style={{
                        cursor:'pointer'
                    }}  src={song.singerimg} alt='no pic found' />
                    <p className='singer-name'>{song.singername}</p>
                    
                </div>
            ))
        }
    </div>
  )
}

export default Singers