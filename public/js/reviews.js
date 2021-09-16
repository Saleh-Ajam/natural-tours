import axios from 'axios';
import {showAlert} from './alerts';

export const createReview =async (review, rating, tour, tourSlug) =>{
    try{
        const res = await axios({
            method: 'POST',
            url: `/api/v1/tours/${tour}/reviews`,
            data: {
                review, rating
            }
        });
        
        if(res.data.status === 'success'){
            showAlert('success','review is created successfuly!');
            window.setTimeout(() => {
                location.assign(`/tour/${tourSlug}`);
            }, 5000);
        }

    }catch(err){
        showAlert('error', err.response.data.message);
    }
}