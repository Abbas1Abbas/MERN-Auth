const express = require('express');
const authRouter = express.Router();
const authController = require('../Controller/authController.js');
const authMiddleware = require('../Middleware/authMiddleware.js');

authRouter.route('/users').get(authController.usersController);

authRouter.route('/login').post(authController.loginController);
authRouter.route('/register').post(authController.registerController);
authRouter.post('/refresh-token', authController.refreshAccessToken);
authRouter.route('/logout').post(authMiddleware.authentication , authController.logoutController);
authRouter.route('/protected').get(authMiddleware.authentication ,authController.protectedController);

authRouter.route('/admin').get(authMiddleware.authentication, authMiddleware.authorization('admin'), authController.adminController);

module.exports = authRouter;