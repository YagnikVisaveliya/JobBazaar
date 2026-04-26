import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { APPLICATION_URL, JOBS_URL } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAllAdminJobs } from "@/redux/jobSlice";
import Navbar from "../shared/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";


function JobEditPage() {
  const navigation = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector((store) => store.job);
  const jobId = params.id;
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoadingApplicants(true);
        const res = await axios.get(`${APPLICATION_URL}/${jobId}/applicants`, {
          withCredentials: true,
        });
        setApplicants(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        if (error.response?.status === 404) {
          setApplicants([]);
        } else {
          toast.error(error.response?.data?.message || "Unable to load applications.");
        }
      } finally {
        setLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const removeJobFromStore = () => {
    if (!Array.isArray(allAdminJobs)) return;
    const updatedJobs = allAdminJobs.filter((job) => job?._id !== jobId);
    dispatch(setAllAdminJobs(updatedJobs));
  };

  const deleteJobHandler = async () => {
    try {
      setDeleting(true);
      const response = await axios.delete(`${JOBS_URL}/${jobId}/delete`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        removeJobFromStore();
        toast.success("Job deleted successfully.");
        setOpenConfirm(false);
        navigation("/admin/jobs");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        removeJobFromStore();
        toast.success("This job was already deleted.");
        setOpenConfirm(false);
        navigation("/admin/jobs");
        return;
      }
      toast.error(error.response?.data?.message || "Unable to delete job. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Delete Job</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review all applications before permanently deleting this job.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigation("/admin/jobs")}>Back</Button>
            <Button
              onClick={() => setOpenConfirm(true)}
              variant="destructive"
              className="bg-red-600"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Job"}
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingApplicants ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : applicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No applications found for this job.
                  </TableCell>
                </TableRow>
              ) : (
                applicants.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item?.applicant?.fullname || "-"}</TableCell>
                    <TableCell>{item?.applicant?.email || "-"}</TableCell>
                    <TableCell>{item?.applicant?.phoneNumber || "-"}</TableCell>
                    <TableCell>{item?.status || "Pending"}</TableCell>
                    <TableCell>{item?.appliedAt ? item.appliedAt.split("T")[0] : "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this job?</DialogTitle>
              <DialogDescription>
                This action is permanent. The job and all linked applications will be deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenConfirm(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="destructive" className="bg-red-600" onClick={deleteJobHandler} disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting
                  </>
                ) : (
                  "Yes, delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export default JobEditPage;
