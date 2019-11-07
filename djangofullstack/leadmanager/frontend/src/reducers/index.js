import { combineReducers } from 'redux';
import leads from './leads';
import predict from './predict';

export default combineReducers({
  leads,
  predict
});
