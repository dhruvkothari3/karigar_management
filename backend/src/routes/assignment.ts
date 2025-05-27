import { Router } from 'express';
import {
  getAllAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentsControllers';


const router = Router();

router.get('/', getAllAssignments);
router.get('/:id', getAssignment);
router.post('/', createAssignment);
router.patch('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
