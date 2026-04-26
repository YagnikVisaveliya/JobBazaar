import React from 'react'
import LatestJobCard from './LatestJobCard'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8]

function LatestJobs() {
    const navigate = useNavigate();
    const {allJobs} = useSelector(store=>store.job); // store mathi job name nu array
    return (
        <div className='max-w-7xl mx-auto my-10 sm:my-20 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center sm:text-left'><span className='text-cyan-400'>Latest & Top </span>Job Openings</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                {
                    allJobs?.length<=0 ? <span className='col-span-full text-center text-gray-500'>No Job Available</span> : allJobs?.slice(0,6).map((job) => <LatestJobCard key={job._id} job={job}/>)
                }
            </div>
        </div>
    )
}

export default LatestJobs