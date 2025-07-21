import express from 'express';
import {
  getAllLawFirms,
  getLawFirmById,
  searchLawFirms,
  getLawFirmsByLocation,
  getLawFirmsBySpecialization,
  getSponsoredLawFirms,
  incrementLawFirmClicks,
  addLawFirmTestimonial
} from '../controllers/partnerLawFirmController.js';
import { searchRateLimit } from '../middleware/rateLimiting.js';

const router = express.Router();

// GET /api/lawfirms - Get all active law firms
router.get('/', getAllLawFirms);

// GET /api/lawfirms/:id - Get specific law firm
router.get('/:id', getLawFirmById);

// GET /api/lawfirms/search - Search law firms
router.get('/search', searchRateLimit, searchLawFirms);

// GET /api/lawfirms/location/:location - Get law firms by location
router.get('/location/:location', getLawFirmsByLocation);

// GET /api/lawfirms/specialization/:specialization - Get law firms by specialization
router.get('/specialization/:specialization', getLawFirmsBySpecialization);

// GET /api/lawfirms/sponsored - Get sponsored law firms
router.get('/sponsored', getSponsoredLawFirms);

// POST /api/lawfirms/:id/click - Increment click count
router.post('/:id/click', incrementLawFirmClicks);

// POST /api/lawfirms/:id/testimonial - Add testimonial
router.post('/:id/testimonial', addLawFirmTestimonial);

export default router;