// import React, { useEffect, useState } from 'react'
// import { RadioGroup, RadioGroupItem } from './ui/radio-group'
// import { Label } from './ui/label'
// import { useDispatch } from 'react-redux';
// import { setSearchJob } from '@/redux/jobSlice';

// const filterData = [
//     {
//         filterType:"Location",
//         array:['Delhi','Bengaluru','Gujarat','Pune','Mumbai','Hyderabad','Noida']
//     },
//     {
//         filterType:"Industry",
//         array:['Frontend Developer','Backend Devloper','Software Engineer','Cloud Engineer','Data Analyst']
//     },
//     {
//         filterType:"Salary",
//         array:['0-40K','41-1lakh','1-5L']
//     }
// ]

// function FilterCard() {

//     const [selectedValue, setSelectedValue] = useState(null);
//     const dispatch = useDispatch();
//     const changeHandler = (value) => {
//         setSelectedValue(value);
//     }

//     useEffect(()=>{
//         dispatch(setSearchJob(selectedValue));
//     },[selectedValue])

//   return (
//     <div className='w-full bg-white p-3 rounded-md border border-gray-100 shadow-1xl'>
//         <h1 className='font-bold text-lg '>Filter Jobs</h1>
//         <hr className='mt-3'/>
//         <RadioGroup value={selectedValue} onValueChange={changeHandler} className='cursor-pointer'>
//             {
//                 filterData.map((data,index)=>(
//                     <div>
//                         <h1 className='font-bold text-lg'>{data.filterType}</h1>
//                         {
//                             data.array.map((item,idx)=>{
//                                 const itemId = `id${index}-${idx}`;
//                                 return(
//                                     <div className='flex items-center space-x-2 my-2'>
//                                         <RadioGroupItem value={item} id={itemId}/>
//                                         <Label htmlFor={itemId} className='cursor-pointer'>{item}</Label>
//                                     </div>
//                                 )
//                             })
//                         }
//                     </div>
//                 ))
//             }
//         </RadioGroup>

//     </div>
//   )
// }

// export default FilterCard


import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux';
import { setSearchJob } from '@/redux/jobSlice';

const filterData = [
    {
        filterType:"Location",
        array:['Gujarat','Maharashtra','Delhi','Karnataka','Telangana','Uttar Pradesh','Tamil Nadu','Punjab','Rajasthan']
    },
    {
        filterType:"Industry",
        array:['Frontend Developer','Backend Developer','Software Engineer','Cloud Engineer','Data Analyst']
    },
    {
        filterType:"Salary",
        array:['0-40K','41-1lakh','1-5L']
    }
]

function FilterCard() {

    const [selectedValue, setSelectedValue] = useState("");
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    useEffect(()=>{
        dispatch(setSearchJob(selectedValue));
    },[selectedValue])

  return (
    <div className='w-full bg-white p-3 sm:p-4 rounded-md border border-gray-100 shadow-xl'>
        <h1 className='font-bold text-base sm:text-lg'>Filter Jobs</h1>
        <hr className='mt-3'/>
        <RadioGroup value={selectedValue} onValueChange={changeHandler} className='cursor-pointer'>
            {
                filterData.map((data,index)=>(
                    <div key={index} className='mb-4'>
                        <h1 className='font-bold text-base sm:text-lg mb-2'>{data.filterType}</h1>
                        {
                            data.array.map((item,idx)=>{
                                const itemId = `id${index}-${idx}`;
                                return(
                                    <div key={itemId} className='flex items-center space-x-2 my-1 sm:my-2'>
                                        <RadioGroupItem value={item} id={itemId}/>
                                        <Label htmlFor={itemId} className='cursor-pointer text-sm sm:text-base'>{item}</Label>
                                    </div>
                                )
                            })
                        }
                    </div>
                ))
            }
        </RadioGroup>
    </div>
  )
}

export default FilterCard