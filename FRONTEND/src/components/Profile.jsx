// import React, { use, useState } from 'react'
// import Navbar from './shared/Navbar'
// import { Avatar, AvatarImage } from './ui/avatar'
// import { Button } from './ui/button'
// import { Contact, Pen, Mail } from 'lucide-react'
// import { Badge } from './ui/badge'
// import { Label } from './ui/label'
// import AppliedJobTable from './AppliedJobTable'
// import UpdateProfile from './UpdateProfile'
// import { useSelector } from 'react-redux'
// import store from '@/redux/store'
// import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'


// // const skills = ['HTML', 'CSS', 'JavaScript', 'React'];
// const resume = true;

// function Profile() {
//     useGetAppliedJobs();
//     const [open,setOpen] = useState(false);
//     const {user} = useSelector(store=>store.auth);
//     return (
//         <div>
//             <Navbar />
//             <div className='max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
//                 <div className='flex justify-between'>
//                     <div className='flex items-center gap-4'>
//                         <Avatar className='h-15 w-15'>
//                             <AvatarImage src={user?.profile?.profilePhoto} alt='profile' />
//                         </Avatar>
//                         <div>
//                             <h1 className='font-medium text-xl'>{user?.fullname}</h1>
//                             <p>{user?.profile?.bio}</p>
//                         </div>
//                     </div>
//                     <Button onClick={()=> setOpen(true)} className='text-right' variant='outline'><Pen /></Button>
//                 </div>
//                 <div className='my-5'>
//                     <div className='flex items-center gap-3'>
//                         <Mail />
//                         <span>{user?.email}</span>
//                     </div>
//                     <div className='flex gap-3 my-3 items-center'>
//                         <Contact />
//                         <span>{user?.phoneNumber}</span>
//                     </div>

//                 </div>
//                 <div className='my-5'>
//                     <h1>Skills</h1>
//                     <div className='flex items-center gap-2 my-1'>
//                         {
//                             user?.profile?.skills.length != 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
//                         }
//                     </div>
//                 </div>
//                 <div className='grid w-full max-w-sm items-center gap-1.5'>
//                     <Label className='text-md font-bold' >Resume</Label>
//                     {
//                         resume ? <a href={user?.profile?.resume} target='_black' className='text-blue-500 hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
//                     }

//                 </div>
//             </div>
//             <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
//                 <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
//                 <AppliedJobTable/>

//             </div>
//             <UpdateProfile open={open} setOpen={setOpen}/>
//         </div>
//     )
// }

// export default Profile


import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Pen, Mail } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfile from './UpdateProfile'
import SavedJobs from './SavedJobs'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const resume = true;

function Profile() {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('applied');
    const { user } = useSelector(store => store.auth);
    return (
        <div className='px-4 sm:px-6 lg:px-8'>
            <Navbar />
            <div className='max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-4 sm:p-6 lg:p-8'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex flex-col sm:flex-row items-center gap-4'>
                        <Avatar className='h-12 w-12 sm:h-15 sm:w-15'>
                            <AvatarImage src={user?.profile?.profilePhoto} alt='profile' />
                        </Avatar>
                        <div className='text-center sm:text-left'>
                            <h1 className='font-medium text-lg sm:text-xl'>{user?.fullname}</h1>
                            <p className='text-sm sm:text-base'>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className='w-full sm:w-auto text-right' variant='outline'><Pen /></Button>
                </div>
                <div className='my-5 space-y-3'>
                    <div className='flex items-center gap-3'>
                        <Mail className='h-4 w-4 sm:h-5 sm:w-5' />
                        <span className='text-sm sm:text-base'>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Contact className='h-4 w-4 sm:h-5 sm:w-5' />
                        <span className='text-sm sm:text-base'>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='font-bold text-base sm:text-lg'>Skills</h1>
                    <div className='flex flex-wrap items-center gap-2 my-2'>
                        {
                            user?.profile?.skills.length != 0 ? user?.profile?.skills.map((item, index) => <Badge key={index} className='text-xs sm:text-sm'>{item}</Badge>) : <span className='text-sm sm:text-base'>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className='text-sm sm:text-base font-bold'>Resume</Label>
                    {
                        resume ? <a href={user?.profile?.resume} target='_blank' className='text-blue-500 hover:underline cursor-pointer text-sm sm:text-base'>{user?.profile?.resumeOriginalName}</a> : <span className='text-sm sm:text-base'>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 my-5'>
                <div className='flex items-center gap-5 border-b border-gray-200 pb-2 mb-5'>
                    <h1 
                        onClick={() => setActiveTab('applied')}
                        className={`font-bold text-lg sm:text-xl cursor-pointer ${activeTab === 'applied' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Applied Jobs
                    </h1>
                    <h1 
                        onClick={() => setActiveTab('saved')}
                        className={`font-bold text-lg sm:text-xl cursor-pointer ${activeTab === 'saved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Saved Jobs
                    </h1>
                </div>
                {activeTab === 'applied' ? <AppliedJobTable/> : <SavedJobs />}
            </div>
            <UpdateProfile open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile
