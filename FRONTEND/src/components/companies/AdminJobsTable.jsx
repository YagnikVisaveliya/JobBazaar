import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import { useNavigate } from 'react-router-dom'

function AdminJobsTable() {
    const { allAdminJobs, searchJobByName } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs)
    const navigate = useNavigate();
    // console.log(allAdminJobs);


    useEffect(() => {
        if (!Array.isArray(allAdminJobs)) {
            setFilterJobs([]);
            return;
        }

        const filtered = allAdminJobs.filter((job) => {
            if (!searchJobByName) {
                return true;
            }
            return (
                job?.title?.toLowerCase().includes(searchJobByName.toLowerCase()) ||
                job?.company?.name.toLowerCase().includes(searchJobByName.toLowerCase())
            );
        });

        setFilterJobs(filtered);
    }, [allAdminJobs, searchJobByName]);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className='text-right'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow key={job._id}>
                            <TableCell>{job?.company?.name}</TableCell>
                            <TableCell>{job?.title}</TableCell>
                            <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                            <TableCell className='text-right'>
                                <Popover>
                                    <PopoverTrigger className='cursor-pointer'>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className='w-40'>
                                        <div
                                            onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                            className='flex gap-4 items-center cursor-pointer w-full text-red-600 mb-2'
                                        >
                                            <Trash2 className='w-4'/>
                                            <span>Delete Job</span>
                                        </div>
                                        <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center gap-4 cursor-pointer w-full'>
                                            <Eye className='w-5'/>
                                            <span>Applicants</span>
                                        </div>
                                        
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}

export default AdminJobsTable