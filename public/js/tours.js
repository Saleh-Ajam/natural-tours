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
    }catch(err){
       showAlert('error',err.response.data.message);
    }
}
export const createTour = async(data) => {
    console.log(data);
    try{
        const res = await axios({
            method: 'POST',
            url: `/api/v1/tours`,
            data
        });
        if(res.status === 200){
            showAlert('success','Tour is created successfully!');
        }
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}