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
            showAlert('success','Review is created successfuly!');
            window.setTimeout(() => {
                location.assign(`/tour/${tourSlug}`);
            }, 5000);
        }

    }catch(err){
        showAlert('error', err.response.data.message);
    }
}

export const deleteReview = async(reviewId)=>{
    var result = confirm("Are you sure you want to delete this review?");
    if(result){
        try{
            const res = await axios({
                method: 'DELETE',
                url: `/api/v1/reviews/${reviewId}`
            });
            console.log(res);
            if(res.status === 204){
                showAlert('success','Review is deleted successfuly!');
                window.setTimeout(() => {
                    location.reload(true);
                }, 5000);
            }

        }catch(err){
            showAlert('error', err.response.data.message);
        }
    }
}