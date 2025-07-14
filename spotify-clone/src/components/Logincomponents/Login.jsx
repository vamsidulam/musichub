import React,{useState} from 'react'
import './Loginstyle.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate=useNavigate();
    const [logindetails,setlogindetails]=useState({
        name:'',
        email:'',
        password:''
    });
    const handleinput=(event)=>{
        event.preventDefault();
        setlogindetails( (prev)=>(
            {
                ...prev,
                [event.target.name]:event.target.value
            }
        ) );
    };
    const handlesubmit=async(event)=>{
        event.preventDefault();
        try{
            const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`,logindetails);
            alert(response.data.msg);
            if(response.data.msg==='Logged in Successfully'){
                // localStorage.setItem('username',response.data.name);
                // localStorage.setItem('email',response.data.email);
                // localStorage.setItem('role',response.data.role);
                localStorage.setItem('token',response.data.token);
                setlogindetails(
                    {
                        name:'',
                        email:'',
                        password:''
                    }
                )
                navigate('/');   
            }
            
        }
        catch(err){
            alert(`error occured in login ${err}`);
        }
    }
  return (
    <div className='box'>
        <form className='form-box' onSubmit={handlesubmit}>
            <h2 style={{
                textAlign:'center'
            }}>Login</h2>
            <div className='details-box'>
                <label>Name: </label>
                <input name='name' autoComplete="off"
                 value={logindetails.name} onChange={handleinput}
                 type='text' placeholder='Enter name' />
            </div>
            <div className='details-box'>
                <label>Email: </label>
                <input name='email' autoComplete="off"
                value={logindetails.email} onChange={handleinput}
                 type='email' placeholder='Enter email' />
            </div>
            <div className='details-box'>
                <label>Password: </label>
                <input name='password' autoComplete="off"
                onChange={handleinput}
                 type='password' value={logindetails.password} placeholder='Enter password' />
            </div>
            <p onClick={()=>navigate('/forgetpassword')} style={{textAlign:'center',
            textDecoration:'underline',
            cursor:'pointer',
            color:'gray'
            }}>Forget password</p>
            <input className='login-button' type='submit' value={'Login'} />
        </form>
        <button onClick={()=>navigate('/register')} className='register-button'>Register</button>
    </div>
  )
}

export default Login