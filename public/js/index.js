import '@babel/polyfill';
import {displayMap} from './mapbox';
import {login, logout, signup, forgotPassword, resetPassword} from './login';
import {updateSettings} from './updateSettings';
import {bookTour} from './stripe';
import { showAlert } from './alerts';

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

if (userMenu){
    userMenu.addEventListener('click', e=>{
        var x = document.getElementById('user_links');
        if (x.style.display === 'block') {
            x.style.display = 'none';
        } else {
            x.style.display = 'block';
        }
    });
}