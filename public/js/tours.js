import axios from 'axios';
import {showAlert} from './alerts';

export const getTour = async(tourId) => {
    try{
        const res = await axios({
            method: 'GET',
            url: `/api/v1/tours/${tourId}`
        });
        if(res.status === 200){
            return res.data.data.data;
        }
        // console.log(res);
    }catch(err){
       showAlert('error',err.response.data.message);
    }
}