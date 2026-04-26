import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { SERVER_URL } from '@/utils/constant'
import { AxiosHeaders } from 'axios'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import store from '@/redux/store'
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react';

function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    })
    const { loading, user } = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const chaneFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file)
        }

        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${SERVER_URL}/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login")
                toast.success(res.data.message || "Account created successfully. Please log in.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to create your account. Please try again.");
        }
        finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);
    return (
        <div>
            <Navbar />
            <div className='flex items-center  justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 p-4 border border-gray-200 rounded-md my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label className='my-2'>Full Name</Label>
                        <Input type='text' value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder='Enter name' />
                    </div>
                    <div className='my-2'>
                        <Label className='my-2'>Email</Label>
                        <Input type='email' value={input.email} name="email" onChange={changeEventHandler} placeholder='xyz@gmail.com' />
                    </div>
                    <div className='mb-2'>
                        <Label className='my-2'>Phone Number</Label>
                        <Input type='text' value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder='Enter name' />
                    </div>
                    <div className='mb-2'>
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
                    <div className='flex items-center justify-between'>
                        <RadioGroup className='flex items-center gap-3 my-5' >
                            <div className="flex items-center space-x-2">
                                <Input type='radio' name='role' value='jobseeker' checked={input.role === 'jobseeker'} onChange={changeEventHandler} />
                                <Label htmlFor="r1">JobSeeker</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input type='radio' name='role' value='recruiter' checked={input.role === 'recruiter'} onChange={changeEventHandler} />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input accept="image/*"
                                name='file'
                                type="file"
                                onChange={chaneFileHandler}
                                className="cursor-pointer" />
                        </div>
                    </div>
                    {
                        loading ? <Button className='w-full my-4'><Loader2 className='mr-2 h-4 w-5 animate-spin' />Please wait</Button>
                            : <Button type="submit" className="w-full my-4">Signup</Button>
                    }

                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup




