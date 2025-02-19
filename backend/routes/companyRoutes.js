import express from 'express';
import { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } from '../controllers/companyControllers.js';
const router = express.Router();

router.post('/', createCompany);
router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;