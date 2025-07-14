import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './Confirmpasswordstyle.css'
import axios from 'axios';

const ForgetPassword = () => {
    const [logindetails,setlogindetails]=useState(
        {
            name:'',
            email:'',
            password:'',
            confirmpassword:''
        }
    )
    const navigate=useNavigate();
    const handleinput=(event)=>{
        event.preventDefault();
        setlogindetails( (prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        } ))
    };
    const handlesubmit=async(event)=>{
        event.preventDefault();
        try{
            const response=await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changepassword`,logindetails);
            alert(response.data.msg);
            setlogindetails(
                {
                    name:'',
                    email:'',
                    password:'',
                    confirmpassword:''
                }
            )
        }
        catch(err){
            alert(`Error occured in Changing password ${err}`)
        }
    }
  return (
    <div className='confirmpassword-box'>
        <form className='confirmpassword-form-box' onSubmit={handlesubmit}>
            <h2 style={{
                textAlign:'center'
            }}>Change Password</h2>
            <div className='confirmpassword-details-box'>
                <label>Name: </label>
                <input name='name' autoComplete="off" value={logindetails.name} onChange={handleinput}
                 type='text' placeholder='Enter name' />
            </div>
            <div className='confirmpassword-details-box'>
                <label>Email: </label>
                <input name='email' autoComplete="off" value={logindetails.email} onChange={handleinput}
                 type='email' placeholder='Enter email' />
            </div>
            <div className='confirmpassword-details-box'>
                <label>Password: </label>
                <input name='password' autoComplete="off" value={logindetails.password} onChange={handleinput}
                 type='password' placeholder='Enter password' />
            </div>
            <div className='confirmpassword-details-box'>
                <label>Confirm Password: </label>
                <input name='confirmpassword' autoComplete="off" value={logindetails.confirmpassword} onChange={handleinput}
                 type='password' placeholder='Confirm password' />
            </div>
            <input className='confirm-button' type='submit' value={'Cofirm'} />
        </form>
    </div>
  )
}

export default ForgetPassword