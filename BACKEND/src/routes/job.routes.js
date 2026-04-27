import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { postJob, deleteJob, getAllJobs, getJobById, getMyJobs, } from "../controller/job.controller.js";

const router = Router();

router.route('/post').post(verifyJWT,postJob);
router.route('/adminjobs').get(verifyJWT,getMyJobs);
router.route('/:id/delete').delete(verifyJWT,deleteJob);

router.route('/get').get(getAllJobs);
router.route('/get/:id').get(getJobById)

export default router;