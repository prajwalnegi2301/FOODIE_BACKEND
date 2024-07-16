import express from 'express';
import { loginCustomer, logOutCustomer, registerCustomer} from '../controllers/user.controllers.js'

const router = express.Router();

// Patient Register
router.post('/registerCustomer', registerCustomer);

// Patient Login
router.post('/loginCustomer',loginCustomer);

// Patient Logout->
router.get('/logoutCustomer',isPatientAuthenticated,logOutCustomer);





// Get Info of All Doctors
router.get('/doctors',getAllDoctors);

// Get details of User
router.get('/patient/me' , getUserDetails);

// Get Info of All Admin
router.get('/getAdmin',isAdminAuthenticated,getAdmin);




// Admin Register
router.post('/admin/register',adminRegister);

//Admin Login
router.post('/admin/login', adminLogin);

// Admin Logout->
router.get('/admin/logout',isAdminAuthenticated,logoutAdmin);

// add new Doctor
router.post("/doctor/addnew", isAdminAuthenticated,addNewDoctor);


export default router;