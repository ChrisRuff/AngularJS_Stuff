import axios from 'axios';
import { PREDICT_NUM, GET_PREDICTION } from './types';

// Predict a number
export const predictNum = (image) => dispatch =>
{
    axios.post("/api/number", image,
      {
        headers: {
          'content-Type': 'application/json'
      }})
      .then(res => {
        dispatch({
          type: PREDICT_NUM,
          payload: res.data.prediction
        });
      }).catch(err => console.log(err));
}

export const getPrediction = () => dispatch =>
{
    axios.get("/api/number/")
      .then(res => {
        dispatch({
          type: PREDICT_NUM,
          payload: res.data
        });
      }).catch(err => console.log(err));
}
