import { Router } from "express";
import { postApplication ,getAppliedJobs, getApplicants, updateStatus, deleteApplication, scheduleInterview, reportProctoringViolation} from "../controller/application.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/apply/:id').post(verifyJWT,postApplication)
router.route('/delete/:id').delete(verifyJWT,deleteApplication)
router.route('/get').get(verifyJWT,getAppliedJobs)
router.route('/:id/applicants').get(verifyJWT,getApplicants)
router.route('/status/:id/update').post(verifyJWT,updateStatus)

router.route('/:id/schedule-interview').post(verifyJWT, scheduleInterview);
router.route('/:id/proctoring-violation').post(verifyJWT, reportProctoringViolation);

export default router;