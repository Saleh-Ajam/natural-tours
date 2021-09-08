import axios from 'axios';
import { showAlert } from './alerts';

export const login = async(email, password) => {
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if(res.data.status === 'success'){
            showAlert('success','Logged in successfuly!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }

    }catch(err){
        showAlert('error',err.response.data.message);
    }
}

export const logout = async () => {
    try{
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if(res.data.status = 'success'){            
            if (['/me','/my-bookings','/submit-user-data'].includes(location.pathname))
                location.assign('/');
            else location.reload(true); // with true it will force the reload from the server and not from the browser cache
        }
    }catch(err){
        showAlert('error', 'Error logging out! try again.');
    }
}
