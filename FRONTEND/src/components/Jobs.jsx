// import React, { useEffect, useState } from 'react'
// import Navbar from './shared/Navbar'
// import FilterCard from './FilterCard'
// import Job from './Job'
// import { useSelector } from 'react-redux'
// import { motion } from 'framer-motion'

// // const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

// function Jobs() {
//     const {allJobs ,searchJob} = useSelector(store=>store.job);
//     const [filterJobs, setFilterJobs] = useState(allJobs);

//     useEffect(() => {
//         if(searchJob){
//             const filteredJobs = allJobs.filter((job) => {
//                 return job.title.toLowerCase().includes(searchJob.toLowerCase()) ||
//                 job.description.toLowerCase().includes(searchJob.toLowerCase()) ||
//                 job.location.toLowerCase().includes(searchJob.toLowerCase());
//             }
//             );
//             setFilterJobs(filteredJobs);
//         }else{
//             setFilterJobs(allJobs);
//         }
//     }, [allJobs, searchJob]);

//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-7xl mx-auto mt-5'>
//                 <div className='flex gap-5'>
//                     <div className='w-20%'>
//                         <FilterCard />
//                     </div>
//                     {
//                         filterJobs.length <= 0 ? <span>Job not found</span> : (
//                             <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
//                                 <div className='grid grid-cols-3 gap-4'>
//                                     {/* {
//                                         jobsArray.map((item, index) => (
//                                             <div>
//                                                 <Job />
//                                             </div>
//                                         ))
//                                     } */}
//                                     {filterJobs.map((job) => (
//                                         <motion.div 
//                                         initial={{ opacity: 0, x: 100 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         exit={{opacity:0, x:-100}}
//                                         transition={{ duration: 0.3, delay: 0.2 }}
//                                         key={job?._id}>
//                                             <Job job={job}/>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )

//                     }
//                 </div>

//             </div>


//         </div>
//     )
// }

// export default Jobs


import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { matchesJobQuery } from '@/utils/jobFilters'

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

function Jobs() {
    const {allJobs ,searchJob} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        const filteredJobs = allJobs.filter((job) => matchesJobQuery(job, searchJob));
        setFilterJobs(filteredJobs);
    }, [allJobs, searchJob]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col md:flex-row gap-5'>
                    <div className='w-full md:w-1/5'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span className='text-center text-gray-500 col-span-full'>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                    {filterJobs.map((job) => (
                                        <motion.div 
                                        className='h-full'
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{opacity:0, x:-100}}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                        key={job?._id}>
                                            <Job job={job}/>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs