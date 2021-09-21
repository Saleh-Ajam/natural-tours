const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.use(viewsController.alerts);
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/page-:pageNum', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/contactus', authController.isLoggedIn, viewsController.getContactUsForm);
router.get('/aboutus', authController.isLoggedIn, viewsController.getAboutUs);
router.get('/forgot-password', authController.isLoggedIn, viewsController.getForgotPasswordForm);
router.get('/reset-password/:resetToken', authController.isLoggedIn, viewsController.getResetPasswordForm);
router.get('/set-password/:setToken', authController.isLoggedIn, viewsController.getSetPasswordForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-reviews', authController.protect, viewsController.getMyReviews);
router.get('/tour/:tourSlug/edit-review', authController.protect, viewsController.getEditReviewForm);
router.get('/tour/:tourSlug/create-review', authController.protect, viewsController.getCreateReviewForm);
router.get('/careers', authController.isLoggedIn, viewsController.getCareers);
router.get('/my-bookings', authController.protect, viewsController.getMyTours);
router.get('/tours/search', authController.isLoggedIn,  viewsController.getSearchResult);
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);
module.exports = router;