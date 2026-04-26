import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { SERVER_URL } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfile = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();


    const [input, setInput] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',

        skills: user?.profile?.skills?.join(',') || ' ',
    });

    const [resumeFile, setResumeFile] = useState(null);

    const EventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
        }
    };

    // const submitHandler = async (e) => {
    //     e.preventDefault();



    //     const formData = new FormData();
    //     formData.append("fullname", input.fullname);
    //     formData.append("email", input.email);
    //     formData.append("phoneNumber", input.phoneNumber);
    //     formData.append("bio", input.bio);
    //     formData.append("skills", input.skills);

    //     if (resumeFile) {
    //         formData.append("file", resumeFile);
    //     }

    //     try {
    //         setLoading(true);
    //         const res = await axios.post(`${SERVER_URL}/profile/update`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             },
    //             withCredentials: true
    //         });

    //         if (res.data.success) { backend ma responce ma to success hatu j nai 
    //             dispatch(setUser(res.data.data.user));
    //             toast.success(res.data.message);
    //             setOpen(false); // Close the dialog on success
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.response?.data?.message || "An error occurred.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        if (resumeFile) {
            formData.append("file", resumeFile);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${SERVER_URL}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            dispatch(setUser(res.data.data));
            toast.success(res.data.message || "Profile updated successfully.");
            setOpen(false); 

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to update your profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen} onClose={() => setOpen(false)}>
                <DialogContent className='sm:max-w-[425px]' onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            {/* Full Name Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right">Name</Label>
                                <Input
                                    id='fullname'
                                    name='fullname'
                                    value={input.fullname}
                                    onChange={EventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            {/* Email Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id='email'
                                    name='email'
                                    type='email'
                                    value={input.email}
                                    onChange={EventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            {/* Phone Number Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                                <Input
                                    id='phoneNumber'
                                    name='phoneNumber'
                                    value={input.phoneNumber}
                                    onChange={EventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            {/* Bio Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id='bio'
                                    name='bio'
                                    value={input.bio}
                                    onChange={EventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            {/* Skills Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                <Input
                                    id='skills'
                                    name='skills'
                                    placeholder="React, Node, etc."
                                    value={input.skills}
                                    onChange={EventHandler}
                                    className='col-span-3'
                                />
                            </div>
                            {/* Resume File Input */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right">Resume</Label>
                                <Input
                                    id='file'
                                    name='file'
                                    type='file'
                                    onChange={fileHandler}
                                    accept='application/pdf'
                                    className='col-span-3'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ?
                                    <Button disabled className='w-full my-4'>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
                                    </Button> :
                                    <Button type="submit" className="w-full my-4">
                                        Update
                                    </Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default UpdateProfile;