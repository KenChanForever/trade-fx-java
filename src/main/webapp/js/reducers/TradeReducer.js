import * as ActionTypes from '../actions/ActionTypes';
import { combineReducers } from 'redux-immutable';

function fetchList(state = {}, action) {
  switch (action.type) {
    case ActionTypes.TRADE_RECEIVE_FETCH_LIST:
      return action.data;
    default:
      return state;
  }
}


export default combineReducers({
  fetchList,
});
