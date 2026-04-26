import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useNavigate, useParams } from 'react-router-dom'
import { COMPANY_URL } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import useGetCompany from '@/hooks/useGetCompany'


function CompanySetup() {
    const params = useParams();
    useGetCompany(params.id)

    const [input, setInput] = useState({
        name: "",
        description: "",
        location: "",
        website: '',
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        //68e116e7796f1344d77f8340
        // for (let [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_URL}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            // console.log(res);
            // console.log("hit");
            toast.success(res.data.message || "Company details updated successfully.");
            navigate('/admin/companies')

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to update company details. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: singleCompany.file || null
            })
        }
    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-8'>
                        <Button onClick={() => navigate('/admin/companies')} variant='outline' className='flex items-center gap-2 text-gray-500 font-semibold'>
                            <ArrowLeft />back
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-1 mt-10'>
                        <div className='grid grid-cols-[140px_1fr] items-center gap-5 mb-5'>
                            <Label className='leading-tight'>Company Name</Label>
                            <Input
                                type='text'
                                name='name'
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div className='grid grid-cols-[140px_1fr] items-center gap-5 mb-5'>
                            <Label>Description</Label>
                            <Input
                                type='text'
                                name='description'
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div className='grid grid-cols-[140px_1fr] items-center gap-5 mb-5'>
                            <Label>Website</Label>
                            <Input
                                type='text'
                                name='website'
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div className='grid grid-cols-[140px_1fr] items-center gap-5 mb-5'>
                            <Label>Location</Label>
                            <Input
                                type='text'
                                name='location'
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div className='grid grid-cols-[140px_1fr] items-center gap-5 mb-5'>
                            <Label>Logo</Label>
                            <Input
                                type='file'
                                accept='image/*'
                                onChange={changeFileHandler}
                            />
                        </div>

                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup



