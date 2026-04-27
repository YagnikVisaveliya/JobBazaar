import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Cast, MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_URL } from '@/utils/constant';
import axios from 'axios';
import { setApplicants } from '@/redux/applications'; // Assuming you can update redux state

const shortlisted = ['Accepted', 'Reviewed', 'Rejected'];
function ApplicantsTable() {

  const { applicants } = useSelector((state) => state.application);
  const dispatch = useDispatch();

  const [openSchedule, setOpenSchedule] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [interviewData, setInterviewData] = useState({ mode: 'Online', date: '', time: '', address: '' });

  const statusHandler = async(status, applicationId) => {
    if (status === 'Accepted') {
      setSelectedAppId(applicationId);
      setOpenSchedule(true);
      return;
    }
    
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_URL}/status/${applicationId}/update`,{status});
      toast.success(`Application status updated to ${status}.`);
      
      // Update local state by refetching or just mutating redux if needed
      // To keep simple, relying on the user to refresh or updating state if you have an action
    }catch(error){
      toast.error(error.response?.data?.message || "Unable to update application status.");
    }
  }

  const scheduleInterview = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${APPLICATION_URL}/${selectedAppId}/schedule-interview`, interviewData);
      if (res.data.success) {
        toast.success("Interview scheduled successfully!");
        setOpenSchedule(false);
      }
    } catch(error) {
      toast.error(error.response?.data?.message || "Failed to schedule interview.");
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
            <TableHead>Interview</TableHead>
            <TableHead className='text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            applicants && applicants?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell className='text-blue-600 cursor-pointer'> <a href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a></TableCell>
                <TableCell>{item?.appliedAt.split("T")[0]}</TableCell>
                <TableCell>
                  {item?.interview?.status === 'Scheduled' && (
                     <div className="text-xs">
                        {item.interview.mode} - {new Date(item.interview.date).toLocaleDateString()} {item.interview.time}
                        {item.interview.mode === 'Online' && (
                            <Button onClick={() => window.open(`/interview/${item._id}`, '_blank')} variant="outline" className="h-6 mt-1 ml-2 text-xs">Join</Button>
                        )}
                        {item.interview.proctoringWarnings > 0 && <span className="text-red-500 block">Warnings: {item.interview.proctoringWarnings}</span>}
                     </div>
                  )}
                </TableCell>
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
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      <Dialog open={openSchedule} onOpenChange={setOpenSchedule}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Schedule Interview</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Set up a time to connect with the candidate.</p>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="flex flex-col gap-2">
              <Label className="font-semibold text-gray-700">Interview Mode</Label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                    onClick={() => setInterviewData({...interviewData, mode: 'Online'})}
                    className={`cursor-pointer p-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${interviewData.mode === 'Online' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                >
                    <span className="font-medium">Online</span>
                </div>
                <div 
                    onClick={() => setInterviewData({...interviewData, mode: 'On-site'})}
                    className={`cursor-pointer p-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${interviewData.mode === 'On-site' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                >
                    <span className="font-medium">On-site</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-semibold text-gray-700">Date</Label>
                <Input type="date" className="p-2 border rounded-lg focus:ring-blue-500" value={interviewData.date} onChange={(e) => setInterviewData({...interviewData, date: e.target.value})} />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-semibold text-gray-700">Time</Label>
                <Input type="time" className="p-2 border rounded-lg focus:ring-blue-500" value={interviewData.time} onChange={(e) => setInterviewData({...interviewData, time: e.target.value})} />
              </div>
            </div>

            {interviewData.mode === 'On-site' && (
              <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                <Label className="font-semibold text-gray-700">Office Address</Label>
                <Input placeholder="e.g. 123 Tech Park, Level 5" className="p-2 border rounded-lg focus:ring-blue-500" value={interviewData.address} onChange={(e) => setInterviewData({...interviewData, address: e.target.value})} />
              </div>
            )}
            
            {interviewData.mode === 'Online' && (
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-start gap-2 text-sm text-indigo-700">
                    <Cast className="w-5 h-5 mt-0.5 shrink-0" />
                    <p>A secure, proctored live video room will be automatically generated for this interview.</p>
                </div>
            )}
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setOpenSchedule(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={scheduleInterview} className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Schedule Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApplicantsTable