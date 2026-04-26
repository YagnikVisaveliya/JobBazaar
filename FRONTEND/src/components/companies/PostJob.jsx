import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { JOBS_URL } from '../../utils/constant.js';

function PostJob() {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    position: "",
    companyId: "",
  });

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const { companies } = useSelector(store => store.company);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const selectChangeHandler = (value) => {
    const selectCompany = companies.find(
      company => company.name.toLowerCase() === value.toLowerCase()
    );
    if (selectCompany) {
      setInput(prev => ({ ...prev, companyId: selectCompany._id }));
    } else {
      // If for some reason no matching company
      setInput(prev => ({ ...prev, companyId: "" }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(
        `${JOBS_URL}/post`,
        input,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Job posted successfully.");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to post the job. Please review details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.title}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.requirements}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.jobType}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experience"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.experience}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>No. of Positions</Label>
              <Input
                type="number"
                name="position"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>
            {companies && companies.length > 0 && (
              <div className="col-span-2 mt-2">
                <Label>Select Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map(company => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Job
            </Button>
          )}

          {(!companies || companies.length === 0) && (
            <p className="text-sm text-red-500 text-center my-1">
              Please register a company first before creating a job.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default PostJob;
