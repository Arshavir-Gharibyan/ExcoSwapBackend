import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { auth } from '@root/middleware/auth'
import { uploadHelpers } from '@root/common'
import { 
  registerAccount,
  sendVerificationCode,
  checkVerificationCode,
  login,
  getMe
} from '@controller/auth'
import { sendEmail } from '@controller/emailVerification'

const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = uploadHelpers.avatars()
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    const fileName = uploadHelpers.fileName(file.originalname)
    cb(null, fileName)
  },
})

const upload = multer({ storage: storage })

const authRoute = Router()
// /**
//  * @swagger
//  * /api/v1/auth/register:
//  *   post:
//  *     summary: createWallet
//  *     description: createWallet
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               username:
//  *                 type: string
//  *                 description: The username.
//  *                 example: Leanne
//  *               firstname:
//  *                 type: string
//  *                 description: The firstname.
//  *                 example: Leanne
//  *               lastname:
//  *                 type: string
//  *                 description: The lastname.
//  *                 example: Leanne
//  *               email:
//  *                 type: string
//  *                 description: The email.
//  *                 example: test@gmail.com
//  *               password:
//  *                 type: string
//  *                 description: The password.
//  *                 example: 123456
//  *               seedparse:
//  *                 type: string
//  *                 description: The seedparse.
//  *                 example: zebra parent avocado margin ready heart space orchard police junior travel today bag action rough system novel large rain detail route spare add mail
//  *               type:
//  *                 type: string
//  *                 description: The type.
//  *                 example: user
//  *     responses:
//  *       200:
//  *         description: Success.
//  *       400:
//  *         description: Can't find user
//  */
authRoute.post(
  "/register",
  asyncHandler(registerAccount)
)

authRoute.post(
  "/sendEmailVerification",
  asyncHandler(auth),
  asyncHandler(sendEmail)
)

authRoute.post(
  '/sendVerificationCode',
  asyncHandler(auth),
  asyncHandler(sendVerificationCode)
)

authRoute.post(
  '/checkVerificationCode',
  asyncHandler(auth),
  asyncHandler(checkVerificationCode)
)
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login
 *     description: login for JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username.
 *                 example: Leanne
 *               password:
 *                 type: string
 *                 description: The password.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Success.
 *       400:
 *         description: Can't find user
 */
authRoute.post(
  '/login',
  asyncHandler(login)
)

authRoute.get(
  '/me',
  asyncHandler(auth),
  asyncHandler(getMe)
)
export default authRoute
