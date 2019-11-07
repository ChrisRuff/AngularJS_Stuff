
import { PREDICT_NUM } from '../actions/types.js';

const initialState = {
  prediction: []
}

export default function(state = initialState, action)
{
    switch(action.type)
    {
      case PREDICT_NUM:
        return {
          ...state,
          prediction: [...state.prediction, action.payload]
        }
      default:
        return state;
    }
}
