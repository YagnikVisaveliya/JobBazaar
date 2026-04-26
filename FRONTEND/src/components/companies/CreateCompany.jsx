import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_URL } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import useGetCompany from '@/hooks/useGetCompany'

function CreateCompany() {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();

    const registorNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_URL}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message || "Company created successfully.");
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to create company. Please try again.");
            
        }
    }

  return (
    <div>
        <Navbar/>
        <div className='max-w-4xl mx-auto'>
            <div className='my-10'>
                <h1 className='font-bold text-2xl'>Your Company Name</h1>
            <p className='text-gray-500'>What would you like to give your company name?</p>
            </div>
            
            <Label>Company Name</Label>
            <Input 
            type="text"
            className='my-2'
            placeholder = "JobBazar"   
            onChange={(e)=>setCompanyName(e.target.value)}         
            />
            <div className='flex items-center gap-2 my-10'>
                <Button variant='outline' onClick={()=> navigate('/admin/companies')} className='cursor-pointer'>Cancel</Button>
                <Button onClick={registorNewCompany} className='cursor-pointer'>Continue</Button>
            </div>
             
        </div>
    </div>
  )
}

export default CreateCompany