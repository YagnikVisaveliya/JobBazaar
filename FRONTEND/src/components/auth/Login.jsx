import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Label } from "../ui/label"
import { RadioGroup } from "../ui/radio-group"
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SERVER_URL } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff } from 'lucide-react'

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  })
  const [showPassword, setShowPassword] = useState(false) // 👈 for toggling
  const { loading, user } = useSelector(store => store.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true))
      const res = await axios.post(`${SERVER_URL}/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.data.user));
        navigate("/");
        toast.success(res.data.message || "Logged in successfully.");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Unable to log in. Please check your credentials and try again.");
    }
    finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(()=>{
    if(user){
      navigate('/');
    }
  },[]);

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        <form onSubmit={submitHandler} className='w-1/2 p-4 border border-gray-200 rounded-md my-10'>
          <h1 className='font-bold text-xl mb-5'>Login</h1>

          {/* Email */}
          <div className='my-2'>
            <Label className='my-2'>Email</Label>
            <Input
              type='email'
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder='Enter your email'
            />
          </div>

          {/* Password with show/hide */}
          <div className='mb-2 relative'>
            <Label className='my-2'>Password</Label>
            <div className='relative'>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder='Enter your password'
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className='flex items-center justify-between'>
            <RadioGroup className='flex items-center gap-3 my-5'>
              <div className="flex items-center space-x-2">
                <Input
                  type='radio'
                  name='role'
                  value='jobseeker'
                  checked={input.role === 'jobseeker'}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="r1">JobSeeker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type='radio'
                  name='role'
                  value='recruiter'
                  checked={input.role === 'recruiter'}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Button */}
          {loading ? (
            <Button className='w-full my-4'>
              <Loader2 className='mr-2 h-4 w-5 animate-spin' /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">Login</Button>
          )}

          <span className='text-sm'>
            Don't have an account? <Link to="/signup" className='text-blue-600'>Sign Up</Link>
          </span>
        </form>
      </div>
    </div>
  )
}

export default Login
