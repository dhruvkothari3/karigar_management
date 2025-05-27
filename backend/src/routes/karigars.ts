import { Router } from 'express';
import { createKarigar, getAllKarigars, getKarigarById, updateKarigarStatus } from '../controllers/karigarControllers';


const router = Router();

router.get('/', getAllKarigars);
router.get('/:id', getKarigarById);
router.post('/', createKarigar);
router.patch('/:id/status', updateKarigarStatus);

export default router;
