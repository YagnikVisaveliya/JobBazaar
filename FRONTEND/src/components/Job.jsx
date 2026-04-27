import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

function Job({ job }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [isSaved, setIsSaved] = useState(false);

  const daysAgo = (mondodbTime) => {
    const createdAt = new Date(mondodbTime);
    const currentTime = new Date();
    const timeDiff = currentTime - createdAt;
    return Math.floor(timeDiff / (1000 * 24 * 60 * 60));
  };

  const truncateDescription = (text, wordCount = 6) => {
    const words = String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (words.length <= wordCount) {
      return text;
    }
    return `${words.slice(0, wordCount).join(" ")}...`;
  };

  useEffect(() => {
    if (user && user.profile?.savedJobs) {
      // Check if job._id exists in the user's savedJobs array
      // The array might contain object IDs as strings or populated objects, so handle both
      const isJobSaved = user.profile.savedJobs.some(
        (savedJob) => (savedJob._id || savedJob) === job?._id,
      );
      setIsSaved(isJobSaved);
    } else {
      setIsSaved(false);
    }
  }, [job?._id, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      toast.error("Please login to save jobs.");
      return;
    }

    try {
      const res = await axios.post(
        `${SERVER_URL}/saved-jobs/${job?._id}`,
        {},
        { withCredentials: true },
      );
      if (res.data.success) {
        const newIsSaved = res.data.data.isSaved;
        setIsSaved(newIsSaved);
        toast.success(res.data.message);

        // Update Redux state so the UI stays in sync after refresh or navigation
        if (user) {
          const currentSavedJobs = user.profile.savedJobs || [];
          let updatedSavedJobs;

          if (newIsSaved) {
            // Job was saved, add its ID if not present
            updatedSavedJobs = [...currentSavedJobs, job?._id];
          } else {
            // Job was unsaved, remove its ID
            updatedSavedJobs = currentSavedJobs.filter(
              (savedJob) => (savedJob._id || savedJob) !== job?._id,
            );
          }

          dispatch(
            setUser({
              ...user,
              profile: {
                ...user.profile,
                savedJobs: updatedSavedJobs,
              },
            }),
          );
        }
      }
    } catch (error) {
      console.log(error);
      if (!error.response) {
        toast.error(
          "Backend server is not reachable. Start backend on http://localhost:8000",
        );
        return;
      }
      toast.error(error.response?.data?.message || "Failed to toggle save");
    }
  };

  return (
    <div className="p-3 sm:p-5 rounded-md shadow-xl bg-white border border-gray-100 hover:shadow-2xl transition-shadow duration-200 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-500">
          {daysAgo(job?.updatedAt) == 0
            ? "today"
            : `${daysAgo(job?.updatedAt)} Day's Ago`}
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          size="icon"
          onClick={handleSaveToggle}
        >
          <Bookmark className={isSaved ? "fill-current text-cyan-500" : ""} />
        </Button>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 my-2">
          <Button className="p-4 sm:p-6" variant="outline" size="icon">
            <Avatar>
              <AvatarImage src={job?.company?.logo} />
            </Avatar>
          </Button>
          <div>
            <h1 className="font-medium text-base sm:text-lg line-clamp-1">
              {job?.company?.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">{job?.location}</p>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-base sm:text-lg my-2 line-clamp-2">
            {job?.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {truncateDescription(job?.description)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge
          className="text-cyan-500 font-bold text-xs sm:text-sm"
          variant="ghost"
        >
          {job?.position} Positions
        </Badge>
        <Badge
          className="text-red-500 font-bold text-xs sm:text-sm"
          variant="ghost"
        >
          {job?.jobType}
        </Badge>
        <Badge
          className="text-purple-600 font-bold text-xs sm:text-sm"
          variant="ghost"
        >
          {job?.salary} LPA
        </Badge>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="cursor-pointer w-full sm:w-auto"
        >
          Details
        </Button>
        <Button
          onClick={handleSaveToggle}
          className="bg-cyan-400 cursor-pointer hover:bg-cyan-600 w-full sm:w-auto"
        >
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Job;
