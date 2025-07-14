import React,{useState} from 'react'
import './RegisterStyle.css'
import axios from 'axios';

const Register = () => {
    const [logindetails,setlogindetails]=useState({
        name:'',
        email:'',
        password:''
    });
    const handleinput=(event)=>{
        event.preventDefault();
        setlogindetails( (prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        }) );
    };
    const handlesubmit=async(event)=>{
        event.preventDefault();
        try{
            const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`,logindetails);
            alert(response.data.msg);
            setlogindetails({
                name:'',
                email:'',
                password:''
            }
            )
        }
        catch(err){
            alert(`Error occured in Registering ${err}`);
        }
    }
  return (
    <div className='register-box'>
        <form className='register-form-box' onSubmit={handlesubmit}>
            <h2 style={{
                textAlign:'center'
            }}>Register</h2>
            <div className='register-details-box'>
                <label>Name: </label>
                <input value={logindetails.name} autoComplete="off" name='name' onChange={handleinput}
                type='text' placeholder='Enter your name' />
            </div>
            <div className='register-details-box'>
                <label>Email: </label>
                <input value={logindetails.email} autoComplete="off" type='email' onChange={handleinput}
                name='email' placeholder='Enter your Email' />
            </div>
            <div className='register-details-box'>
                <label>Password: </label>
                <input value={logindetails.password} autoComplete="off" type='password' onChange={handleinput}
                name='password' placeholder='Enter password' />
            </div>
            <input className='register-btn' type='submit' value={'Register'} />
        </form>
    </div>
  )
}

export default Register