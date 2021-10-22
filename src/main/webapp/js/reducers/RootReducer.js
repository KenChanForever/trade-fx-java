import { combineReducers } from 'redux-immutable';
import tradeReducer from './TradeReducer';

export default combineReducers({
  trade: tradeReducer,
});
