import express from 'express';

import { getRentals, postNewRental, postFinishRental, deleteRentalById, getRentalMetrics } from '../controllers/rentalController.js'
import { validateQueryFilterRentals, validateRentalInputs, validateRentalIdInput } from '../middlewares/rentalMiddleware.js'

const router = express.Router()

router.get('/rentals', validateQueryFilterRentals, getRentals)
router.post('/rentals', validateRentalInputs, postNewRental)
router.post('/rentals/:ID/return', validateRentalIdInput, postFinishRental)
router.delete('/rentals/:ID', validateRentalIdInput, deleteRentalById)

router.get('/rentals/metrics', getRentalMetrics)

export default router