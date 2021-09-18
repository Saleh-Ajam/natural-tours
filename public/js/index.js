import '@babel/polyfill';
import {displayMap} from './mapbox';
import {login, logout, signup, forgotPassword, resetPassword} from './login';
import {updateSettings} from './updateSettings';
import {bookTour} from './stripe';
import { showAlert } from './alerts';
import {createReview, deleteReview, editReview} from './reviews';
import {getTour} from './tours';
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const contactUsForm = document.querySelector('.form--contactus');
const forgotPasswordForm = document.querySelector('.form--forgot--password');
const resetPasswordForm = document.querySelector('.form--reset--password');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const userMenu = document.getElementById('user-menu-icon');
const createReviewBtnTourDetail = document.getElementById('add-review-btn');
// const createReviewForm = document.querySelector('.input-form-create-review');
const createReviewBtnFormInput = document.getElementById('button-create-review');
const deleteMyReviewBtns = document.getElementsByClassName('delete-my-review-btn');
const editMyReviewButtonFormInput = document.getElementById('button-edit-review');
const searchButton = document.getElementById('search-btn');
// VALUES

// DELEGATION
if(mapBox){
    const locations =JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if(loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

    if(contactUsForm) {
        contactUsForm.addEventListener('submit', e => {
            showAlert('success', 'Thanks for your feedback',7);
            setTimeout(() =>{
                location.reload(true);
            }, 8500);
        });
    }
    
if(signupForm){
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        const name = document.getElementById('name').value;
        signup({name, email, password, passwordConfirm});
    });
}

if(forgotPasswordForm){
    forgotPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        forgotPassword(email);
    });
}
if(resetPasswordForm){
    resetPasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('confirm-password').value;
        const token = location.pathname.split('/')[location.pathname.split('/').length-1];
        resetPassword(token, password, passwordConfirm);
    });
}
if(logOutBtn) logOutBtn.addEventListener('click', logout)

if(userDataForm) {
    userDataForm.addEventListener('submit', e=>{
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        window.setTimeout(() => {
            location.assign('/me');
        }, 1000);
        updateSettings(form, 'data');
    });
    document.querySelector('.form__upload').onchange = function() {
        if (this.files && this.files[0]) {
          var reader = new FileReader();
          reader.onload = function(e) {
            // e.target.result is a base64-encoded url that contains the image data
            document.querySelector('.form__user-photo').setAttribute('src', e.target.result);
          };
          reader.readAsDataURL(this.files[0]);
        }
      }
}

if(userPasswordForm) userPasswordForm.addEventListener('submit', async e =>{
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent= 'Updating ...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';

});

if(bookBtn){
    bookBtn.addEventListener('click', e=>{
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    })
}

const alertMessage = document.querySelector('body').dataset.alert;
if(alertMessage) showAlert('success', alertMessage, 20);


const respondToVisibility = function(element, callback) {
    var options = {
      root: document.documentElement
    }
  
    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        callback(entry.intersectionRatio > 0);
      });
    }, options);
  
    observer.observe(element);
}
      



if (userMenu){
    respondToVisibility(userMenu, visible => { 
        var x = document.getElementById('user_links');
        if(!visible) {
            x.style.display = 'block';
            console.log('not visible');
        }else{
            x.style.display = 'none';
        }
    });
    userMenu.addEventListener('click', e=>{
        var x = document.getElementById('user_links');
        if (x.style.display === 'block') {
            x.style.display = 'none';
        } else {
            x.style.display = 'block';
        }
    });
}

if(createReviewBtnTourDetail){
    const tourSlug = createReviewBtnTourDetail.dataset.tourSlug;
    createReviewBtnTourDetail.addEventListener('click',e=>{
        location.assign(`/tour/${tourSlug}/create-review`);
    });
}
if(createReviewBtnFormInput){
    createReviewBtnFormInput.addEventListener('click', e=>{
        e.preventDefault();
        const tourId = createReviewBtnFormInput.dataset.tourId;
        const tourSlug = createReviewBtnFormInput.dataset.tourSlug;
        const rating = document.querySelector('input[name="rate"]:checked')? document.querySelector('input[name="rate"]:checked').value : 0;
        const msg = document.getElementById('edit-text').value;
        // console.log(msg, rating, tourId, tourSlug);
        createReview(msg, rating, tourId, tourSlug); 
    });
}
if(deleteMyReviewBtns){
    for (let i=0 ; i< deleteMyReviewBtns.length; i++)
        deleteMyReviewBtns[i].onclick=()=>deleteReview(deleteMyReviewBtns[i].dataset.reviewId);
}


if(editMyReviewButtonFormInput){
    editMyReviewButtonFormInput.addEventListener('click', e=>{
        e.preventDefault();
        const rating = document.querySelector('input[name="rate"]:checked')? document.querySelector('input[name="rate"]:checked').value : 0;
        const msg = document.getElementById('edit-text').value;
        editReview(rating, msg, document.getElementById('edit-text').dataset.reviewId);
    })
}
if(searchButton) {
    searchButton.addEventListener('click', e=>{
        e.preventDefault();
        const searchQuery = document.getElementById('searchbar').value;
        location.assign(`/tours/search?name=${searchQuery}`);
    });
}