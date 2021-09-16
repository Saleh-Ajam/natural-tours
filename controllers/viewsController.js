const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.alerts = (req, res, next) => {
  const {alert} = req.query;
  if (alert === 'booking'){
    res.locals.alert = 'Your booking was successful! Please check your email for a confirmation. If your booking doesn\'t show up here immediately, please come back later.';
  }
  next();
}

exports.getOverview =catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const perPage = 6;
  const numPages = Math.ceil(await Tour.find().countDocuments() / perPage);
  let currentPage = req.params.pageNum || 1;
  currentPage = currentPage * 1;
  tours = await Tour.find().limit(perPage).skip((currentPage-1) * perPage);
  // 2) Build template
  // 3) Render that template using tour data from 1) 
    res.status(200).set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    ).render('overview',{
      title: 'All Tours',
      tours,
      numPages,
      currentPage
    });
});

exports.getTour = catchAsync(async(req, res, next) => {
  // 1) get the data, for the requested tour (including reviews and guides )
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if(!tour) return next(new AppError('There is no tour with that name.', 404));
  // 2) Build templdate

  // 3) Render template using the data from 1)
  res.status(200)
  .set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  ).render('tour',{
    title: `${tour.name} Tour`, 
    tour
  });
});

exports.getLoginForm = (req, res, next) => {
  if(res.locals.user) return next(new AppError('You are already logged in.', 403));
  // res.setHeader('Content-Security-Policy', 'script-src cdnjs.cloudflare.com'); 
  // connect-src script-src cdnjs.cloudflare.com now is not necessary because we install axios as npm module
  // res.status(200).set(
    // 'Content-Security-Policy',
    // "default-src 'self' https://cdnjs.cloudflare.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;connect-src http://127.0.0.1:3000/api/v1/users/login"
      // )
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('login',{
    title: 'Log into your account'
  })
};
exports.getSignupForm = (req, res, next) => {
  if(res.locals.user) return next(new AppError('You are already logged in.', 403));

  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('signup',{
    title: 'Sign up'
  })
};
exports.getContactUsForm = (req, res, next) => {
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('input_form',{
    title: 'Contact us',
    firstInputTitle:'Contact us',
    firstInput:'email',
    buttonText: 'Send',
    formType: 'contactus',
    buttonId: 'send-feedback'
  })
};

exports.getCreateReviewForm = catchAsync(async(req, res, next) => {
  const tour = await Tour.findOne({slug: req.params.tourSlug});
    res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('input_form',{
    title: 'Create review',
    firstInputTitle:'Adding Review',
    firstInput:'rating',
    buttonText: 'Submit',
    formType: 'create-review',
    buttonId: 'create-review',
    tourId:tour.id,
    tourSlug: req.params.tourSlug
  })
});

exports.getForgotPasswordForm = (req, res, next) => {
  if(res.locals.user) return next(new AppError('You are already logged in.', 403));

  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('forgot_password',{
    title: 'Forgot password'
  })
};

exports.getResetPasswordForm = (req, res, next) => {
  if(res.locals.user) return next(new AppError('You are already logged in.', 403));

  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('reset_password',{
    title: 'Reset password'
  })
};

exports.getAboutUs = catchAsync(async(req, res, next) => {
  const guides = await User.find({$or: [{role: 'guide'},{role:'lead-guide'}]});
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('aboutus',{
    title: 'About us',
    guides
  })
});

exports.getCareers = catchAsync(async(req, res, next) => {
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  )
  .render('careers',{
    title: 'Careers'
  })
});

exports.getAccount = (req, res) => {
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  ).render('account',{
    title: 'Your Account'
  });
}


exports.getMyTours = catchAsync(async(req, res, next) => {
  // we can do virtual populate on the tours
    /// 1) Fin all bookings
    const bookings = await Booking.find({user: req.user.id })
    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({_id: {$in: tourIDs}});

    res.status(200).set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    ).render('overview', {title: 'My Bookings',tours});
});


exports.getMyReviews = catchAsync(async(req, res, next) => {

    const reviews = await Review.find({user: req.user.id })


    res.status(200).set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    ).render('my_reviews', {title: 'My Reviews',reviews});
});

exports.updateUserData = catchAsync(async(req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  },{new: true, runValidators: true});
  res.status(200).set(
    'Content-Security-Policy',
    "default-src 'self' https://*.mapbox.com https://*.stripe.com/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://*.stripe.com/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  ).render('account', {
    title: 'Your Account',
    user: updatedUser
  });
});