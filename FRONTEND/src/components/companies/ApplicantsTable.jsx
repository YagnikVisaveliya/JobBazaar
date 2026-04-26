import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Cast, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_URL } from '@/utils/constant';
import axios from 'axios';

const shortlisted = ['Accepted', 'Reviewed', 'Rejected'];
function ApplicantsTable() {

  const { applicants } = useSelector((state) => state.application);

  const statusHandler = async(status, applicationId) => {
    try {
      // console.log("hello");
      console.log("Updating status:", status, "for applicant:", applicationId)
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_URL}/status/${applicationId}/update`,{status});
      // console.log(res);
      
      toast.success(`Application status updated to ${status}.`);

    }catch(error){
      toast.error(error.response?.data?.message || "Unable to update application status. Please try again.");
    }
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of Applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact us</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead className='text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            applicants && applicants?.map((item) => (
              <tr key={item._id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell className='text-blue-600 cursor-pointer'> <a href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a></TableCell>
                <TableCell>{item?.appliedAt.split("T")[0]}</TableCell>
                <TableCell className='text-right'>
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal className='cursor-pointer' />
                    </PopoverTrigger>
                    <PopoverContent className='w-32'>
                      {
                        shortlisted.map((status, index) => {
                          return (
                            <div onClick={()=>statusHandler(status,item._id)} key={index} className='cursor-pointer hover:bg-gray-100 p-2 rounded-md'>
                              <span>{status}</span>
                            </div>
                          )
                        })
                      }
                    </PopoverContent>
                  </Popover>

                </TableCell>
              </tr>
            ))
          }

        </TableBody>

      </Table>
    </div>
  )
}

export default ApplicantsTable