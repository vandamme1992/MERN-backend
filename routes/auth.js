import {Router} from 'express'
import {register, login, getMe} from "../controllers/auth.js";
import {checkAuth} from "../utils/checkAuth.js";

const router = new Router()

//Register user
//http://localhost:3002/api/register
router.post('/register', register)

//Login user
//http://localhost:3002/api/login
router.post('/login', login)

//Get Me
//http://localhost:3002/api/auth/me
router.get('/me',checkAuth, getMe)

export default router