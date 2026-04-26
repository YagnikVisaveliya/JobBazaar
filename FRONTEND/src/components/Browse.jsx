import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import useGetJobs from '@/hooks/useGetJobs';
import { matchesJobQuery } from '@/utils/jobFilters';
import { setSearchJob } from '@/redux/jobSlice';
import { Input } from './ui/input';


function Browse() {
    useGetJobs();
    const dispatch = useDispatch();
    const { allJobs } = useSelector(store => store.job);
    const { searchJob } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        const filteredJobs = allJobs.filter((job) => matchesJobQuery(job, searchJob));
        setFilterJobs(filteredJobs);
    }, [allJobs, searchJob]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8'>
                <div className='mb-6'>
                    <Input
                        type='text'
                        value={searchJob}
                        placeholder='Search by role, location, company...'
                        onChange={(e) => dispatch(setSearchJob(e.target.value))}
                        className='w-full md:max-w-md'
                    />
                    
                </div>
                <h1 className='font-bold text-xl my-6'>Search Results ({filterJobs.length})</h1>
                {
                    filterJobs.length === 0 ? (
                        <p className='text-gray-500 text-center'>No jobs available for "{searchJob}".</p>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {
                                filterJobs.map((job) => {
                                    return (
                                        <Job key={job._id} job={job} />
                                    )
                                })
                            }
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Browse   