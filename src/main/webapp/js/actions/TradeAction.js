import { get  } from './CommonAction';
import * as ActionTypes from './ActionTypes';
const server = '.';


export function fetchAllTrades() {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.TRADE_REQUEST_FETCH_LIST,
    });
    return get("trade/listAll/")
      .then(response => response.json())
      .then((data) => dispatch({
        type: ActionTypes.TRADE_RECEIVE_FETCH_LIST, data
      }));
    ;
  }
}


