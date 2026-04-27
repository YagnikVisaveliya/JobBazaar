// import React from 'react'
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
// import { Badge } from './ui/badge'
// import { useSelector } from 'react-redux';



// function AppliedJobTable() {
//     const { allAppliedJobs } = useSelector(store => store.job);
//   return (
//     <div>
//         <Table>
//             <TableCaption>A list of your applies jobs</TableCaption>
//             <TableHeader>
//                 <TableRow>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Job Role</TableHead>
//                     <TableHead>Company</TableHead>
//                     <TableHead>Salary</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>JobType</TableHead>
//                     <TableHead className='text-right'>Status</TableHead>
//                 </TableRow>
//             </TableHeader>
//             <TableBody>
//                 {
//                     allAppliedJobs.length <= 0 ? <span>No applied jobs found</span> : allAppliedJobs.map((item)=>(
//                         <TableRow key={item?.job._id}>
//                             <TableCell>{item?.appliedAt.split("T")[0]}</TableCell>
//                             <TableCell>{item?.job?.title}</TableCell>
//                             <TableCell>{item?.job?.company?.name}</TableCell>
//                             <TableCell>{item?.job?.salary} LPA</TableCell>
//                             <TableCell>{item?.job?.location}</TableCell>
//                             <TableCell>{item?.job?.jobType}</TableCell>
//                             <TableCell className='text-right'><Badge className={`${item?.status == 'Rejected' ? 'bg-red-500' : item.status == 'Pending' ? 'bg-gray-500' : item.status== 'Reviewed' ? 'bg-yellow-500' : 'bg-green-500'}`}>{item?.status}</Badge></TableCell>
//                         </TableRow>
//                     ))
//                 }
//             </TableBody>
//         </Table>
//     </div>
//   )
// }

// export default AppliedJobTable


import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

function AppliedJobTable() {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px] md:min-w-full">
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Interview</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-4 text-gray-500 text-sm"
              >
                No applied jobs found
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((item) => (
              <TableRow key={item?.job?._id}>
                <TableCell>{item?.appliedAt.split("T")[0]}</TableCell>
                <TableCell>{item?.job?.title}</TableCell>
                <TableCell>{item?.job?.company?.name}</TableCell>
                <TableCell>{item?.job?.salary} LPA</TableCell>
                <TableCell>{item?.job?.location}</TableCell>
                <TableCell>
                  {item?.interview?.status === 'Scheduled' ? (
                     <div className="text-xs">
                        <span className="font-semibold block">{item.interview.mode} Interview</span>
                        <span>{new Date(item.interview.date).toLocaleDateString()} {item.interview.time}</span>
                        {item.interview.mode === 'Online' && (
                            <button onClick={() => window.open(`/interview/${item._id}`, '_blank')} className="block mt-1 text-blue-600 hover:underline">Join Interview</button>
                        )}
                        {item.interview.mode === 'On-site' && (
                            <span className="block mt-1 text-gray-600">At: {item.interview.address}</span>
                        )}
                     </div>
                  ) : <span className="text-gray-400">-</span>}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      item?.status === "Rejected"
                        ? "bg-red-500"
                        : item?.status === "Pending"
                        ? "bg-gray-500"
                        : item?.status === "Reviewed"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {item?.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AppliedJobTable;



