import axios from 'axios';
import {showAlert} from './alerts';

export const ccreateReview =(review, rating, tour, user) =>{
    try{
        const res = await axios({
            method: 'POST',
            url: '/api/v1/reviews',
            data: {
                review, rating, tour, user
            }
        });
        
        if(res.data.status === 'success'){
            showAlert('success','review is created successfuly!');
            window.setTimeout(() => {
                location.reload(true);
            }, 1500);
        }

    }catch(err){
        showAlert('error', err.message);
    }
}