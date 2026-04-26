// import React, { useEffect, useState } from 'react'
// import { Badge } from './ui/badge'
// import { Button } from './ui/button'
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { APPLICATION_URL, JOBS_URL } from '@/utils/constant';
// import { setSingleJob } from '@/redux/jobSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import store from '@/redux/store';
// import { toast } from 'sonner';

// const JobDescription = () => {
//     const { singleJob } = useSelector(store => store.job)
//     const { user } = useSelector(store => store.auth)
//     const params = useParams();
//     const jobId = params.id;
//     const isInitiallyApplied = singleJob?.applications?.some(application => application?.applicant == user?._id) || false;
//     const [isApplied,setIsApplied] = useState(isInitiallyApplied);
//     const dispatch = useDispatch();

//     const applyJobHandler = async () => {
//         try {
//             const res = await axios.post(`${APPLICATION_URL}/apply/${jobId}`, null, { withCredentials: true });
//             toast.success(res.data.message);
//             setIsApplied(true); // update with local state
//             const updatedSingleJob = {...singleJob,applications:[...singleJob.applications,{applicant:user?._id}]}
//             dispatch(setSingleJob(updatedSingleJob)) // this for real time ui update
//         }   
//         catch(error){
//             console.log(error);
//             toast.error(error.response?.data?.message );
//         }
//     }

//     useEffect(() => {
//         const fetchSingleJob = async () => {
//             try {
//                 const res = await axios.get(`${JOBS_URL}/get/${jobId}`, { withCredentials: true });
//                 dispatch(setSingleJob(res.data.data));                 
//                 setIsApplied(res.data.data.applications.some(application=>application.applicant==user?._id))
//             } catch (error) {
//                 console.log(error);

//             }
//         }
//         fetchSingleJob();
//     }, [jobId, dispatch, user?._id])

//     return (
//         <div className='max-w-7xl mx-auto my-10'>
//             <div className='flex justify-between items-center'>
//                 <div>
//                     <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
//                     <div className='flex items-center gap-2 mt-4'>
//                         <Badge className='text-cyan-500 font-bold' variant='ghost'>{singleJob?.position} Positions</Badge>
//                         <Badge className='text-red-500 font-bold' variant='ghost'>{singleJob?.jobType}</Badge>
//                         <Badge className='text-purple-600 font-bold' variant='ghost'>{singleJob?.salary} LPA</Badge>
//                     </div>
//                 </div>
//                 <Button onClick={isApplied ? null : applyJobHandler} disabled={isApplied} className={`rounded-lg ${isApplied ? 'bg-gray-600 hover:cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-800 cursor-pointer'}`}>{isApplied ? 'Alredy Applied' : 'Apply Now'}</Button>
//             </div>
//             <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
//             <div className='my-4'>
//                 <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.position}</span></h1>
//                 <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
//                 <h1 className='font-bold my-1'>Decription: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
//                 <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yr</span></h1>
//                 <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
//                 <h1 className='font-bold my-1'>Total Application: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
//                 <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.updatedAt.split("T")[0]}</span></h1>
//             </div>

//         </div>
//     )
// }

// export default JobDescription


import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_URL, JOBS_URL } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const params = useParams();
    const jobId = params.id;
    const isInitiallyApplied = singleJob?.applications?.some(application => application?.applicant == user?._id) || false;
    const [isApplied,setIsApplied] = useState(isInitiallyApplied);
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.post(`${APPLICATION_URL}/apply/${jobId}`, null, { withCredentials: true });
            toast.success(res.data.message || "Application submitted successfully.");
            setIsApplied(true); // update with local state
            const updatedSingleJob = {...singleJob,applications:[...singleJob.applications,{applicant:user?._id}]}
            dispatch(setSingleJob(updatedSingleJob)) // this for real time ui update
        }   
        catch(error){
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to apply for this job right now.");
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOBS_URL}/get/${jobId}`, { withCredentials: true });
                dispatch(setSingleJob(res.data.data));                 
                setIsApplied(res.data.data.applications.some(application=>application.applicant==user?._id))
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id])

    return (
        <div className='max-w-7xl mx-auto my-5 sm:my-10 px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div className='flex-1'>
                    <h1 className='font-bold text-xl sm:text-2xl md:text-3xl'>{singleJob?.title}</h1>
                    <div className='flex flex-wrap items-center gap-2 mt-4'>
                        <Badge className='text-cyan-500 font-bold text-xs sm:text-sm' variant='ghost'>{singleJob?.position} Positions</Badge>
                        <Badge className='text-red-500 font-bold text-xs sm:text-sm' variant='ghost'>{singleJob?.jobType}</Badge>
                        <Badge className='text-purple-600 font-bold text-xs sm:text-sm' variant='ghost'>{singleJob?.salary} LPA</Badge>
                    </div>
                </div>
                <Button onClick={isApplied ? null : applyJobHandler} disabled={isApplied} className={`rounded-lg w-full sm:w-auto ${isApplied ? 'bg-gray-600 hover:cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-800 cursor-pointer'}`}>{isApplied ? 'Already Applied' : 'Apply Now'}</Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4 text-lg sm:text-xl'>Job Description</h1>
            <div className='my-4 space-y-2'>
                <h1 className='font-bold my-1 text-sm sm:text-base'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.position}</span></h1>
                <h1 className='font-bold my-1 text-sm sm:text-base'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1 text-sm sm:text-base'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1 text-sm sm:text-base'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yr</span></h1>
                <h1 className='font-bold my-1 text-sm sm:text-base'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
                <h1 className='font-bold my-1 text-sm sm:text-base'>Total Application: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1 text-sm sm:text-base'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.updatedAt.split("T")[0]}</span></h1>
            </div>
        </div>
    )
}

export default JobDescription