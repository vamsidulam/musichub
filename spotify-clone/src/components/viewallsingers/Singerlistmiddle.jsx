import React,{useState,useEffect} from 'react'
import { setleftmenu,setrightmenu } from '../Store/Reducer';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Singerliststyle.css';

const Singerlistmiddle = () => {
    const navigate=useNavigate();
    const [songsdata,setsongsdata]=useState([]);
    const isleftbarshow = useSelector((state) => state.songdata.leftmenu);
    const isrightbarshow = useSelector((state) => state.songdata.rightmenu);
    const [left, setLeft] = useState('320px');
    const [right,setright]=useState('300px');
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

    const handlesinger=(id)=>{
        navigate(`/songs/${id}`)
    }

  return (
    <div className='all-singers-list-box' style={{
        position: 'absolute',
        left,
        right,
        top: '11px',
        display: 'grid',
        color: 'black',
        height: '86.3vh',
        overflowY: 'auto'
    }} >
        <p className='singer-title'>Singers : </p>
        <div className='all-singers-list'>
        {
            songsdata.map((song,index) => (
                <div key={song._id} className='singer-box'>
                    <img onClick={()=>handlesinger(song._id)} style={{
                        cursor:'pointer'
                    }}  src={song.singerimg} alt='no pic found' />
                    <p className='singer-name'>{song.singername}</p>
                    
                </div>
            ))
        }
        </div>
    </div>
  )
}

export default Singerlistmiddle