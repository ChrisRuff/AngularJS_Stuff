import axios from 'axios';
import { PREDICT_NUM } from './types';

// Predict a number
export const predictNum = (image) => dispatch =>
{
    console.log(image);
    axios.post('/api/number/', image)
      .then(res => {
        dispatch({
          type: PREDICT_NUM,
          payload: res.data
        });
      }).catch(err => console.log(err));
}
