import express from 'express'

import { getCustomers, getCustomerById, postNewCustomer, editCustomerById } from '../controllers/customersController.js'
import { validateQueryFilterCustomers, validateCustomerId, validateCustomer, validateNewCpf } from '../middlewares/customerMiddleware.js'

const router = express.Router();

router.get('/customers', validateQueryFilterCustomers, getCustomers);
router.get('/customers/:ID', validateCustomerId, getCustomerById);
router.post('/customers', validateCustomer, validateNewCpf, postNewCustomer);
router.put('/customers/:ID', validateCustomer, validateCustomerId, validateNewCpf, editCustomerById);

export default router;