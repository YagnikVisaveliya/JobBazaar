




// import React, { use, useState } from 'react'
// import { Button } from './ui/button'
// import { Search } from 'lucide-react'
// import { useDispatch } from 'react-redux';
// import { setSearchJob } from '@/redux/jobSlice';
// import { useNavigate } from 'react-router-dom';

// function HeroSection() {
//     const navigate = useNavigate();
//     const [query , setQuery] = useState("")
//     const dispatch = useDispatch();

//     const searchJobHandler = () => {
//         dispatch(setSearchJob(query));
//         navigate('/browse')
//     }

//     return (
//         <div className='text-center'>
//             <div className='flex flex-col gap-5 my-10'>
//                 <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#cd8416] font-medium'>No.1 Job Hunt WebSite</span>
//                 <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-purple-600'>Dream Jobs</span></h1>
//                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint temporibus nemo expedita autem labore. Non.</p>
//             </div>
//             <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
//                 <input
//                     type="text"
//                     placeholder='Find your dream job'
//                     onChange={(e)=>setQuery(e.target.value)}
//                     className='outline-none border-none w-full'
//                 />
//                 <Button onClick={searchJobHandler} className='rounded-r-full bg-purple-700 w-1/10'>
//                     <Search className='h-5 w-5' />
//                 </Button>

//             </div>
//         </div>
//     )
// }

// export default HeroSection  


import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchJob } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("")
    const dispatch = useDispatch();

    const searchJobHandler = () => {
        dispatch(setSearchJob(query));
        navigate('/browse')
    }

    return (
        <div className='text-center px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#cd8416] font-medium text-sm sm:text-base'>No.1 Job Hunt WebSite</span>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-purple-600'>Dream Jobs</span></h1>
                <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
                    Find opportunities that match your skills and passion. Thousands of
                    recruiters are looking for candidates like you.
                </p>
                </div>
                <div className='flex w-full sm:w-[60%] md:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-2 sm:gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream job'
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                searchJobHandler();
                            }
                        }}
                        className='outline-none border-none w-full text-sm sm:text-base'
                    />
                    <Button onClick={searchJobHandler} className='rounded-r-full bg-purple-700 w-12 sm:w-16 flex-shrink-0'>
                        <Search className='h-4 w-4 sm:h-5 sm:w-5' />
                    </Button>
                </div>
            </div>
            )
}

            export default HeroSection