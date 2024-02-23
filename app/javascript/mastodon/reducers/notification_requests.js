import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

import {
  NOTIFICATION_REQUESTS_EXPAND_REQUEST,
  NOTIFICATION_REQUESTS_EXPAND_SUCCESS,
  NOTIFICATION_REQUESTS_EXPAND_FAIL,
  NOTIFICATION_REQUESTS_FETCH_REQUEST,
  NOTIFICATION_REQUESTS_FETCH_SUCCESS,
  NOTIFICATION_REQUESTS_FETCH_FAIL,
  NOTIFICATION_REQUEST_FETCH_REQUEST,
  NOTIFICATION_REQUEST_FETCH_SUCCESS,
  NOTIFICATION_REQUEST_FETCH_FAIL,
  NOTIFICATION_REQUEST_ACCEPT_REQUEST,
  NOTIFICATION_REQUEST_DISMISS_REQUEST,
  NOTIFICATIONS_FOR_REQUEST_FETCH_REQUEST,
  NOTIFICATIONS_FOR_REQUEST_FETCH_SUCCESS,
  NOTIFICATIONS_FOR_REQUEST_FETCH_FAIL,
  NOTIFICATIONS_FOR_REQUEST_EXPAND_REQUEST,
  NOTIFICATIONS_FOR_REQUEST_EXPAND_SUCCESS,
  NOTIFICATIONS_FOR_REQUEST_EXPAND_FAIL,
} from 'mastodon/actions/notifications';

import { notificationToMap } from './notifications';

const initialState = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
  next: null,
  current: ImmutableMap({
    isLoading: false,
    item: null,
    notifications: ImmutableMap({
      items: ImmutableList(),
      isLoading: false,
      next: null,
    }),
  }),
});

const normalizeRequest = request => fromJS({
  ...request,
  account: request.account.id,
});

export const notificationRequestsReducer = (state = initialState, action) => {
  switch(action.type) {
  case NOTIFICATION_REQUESTS_FETCH_SUCCESS:
    return state.withMutations(map => {
      map.set('items', ImmutableList(action.requests.map(normalizeRequest)));
      map.set('isLoading', false);
      map.set('next', action.next);
    });
  case NOTIFICATION_REQUESTS_EXPAND_SUCCESS:
    return state.withMutations(map => {
      map.update('items', list => list.concat(ImmutableList(action.requests.map(normalizeRequest))));
      map.set('isLoading', false);
      map.set('next', action.next);
    });
  case NOTIFICATION_REQUESTS_EXPAND_REQUEST:
  case NOTIFICATION_REQUESTS_FETCH_REQUEST:
    return state.set('isLoading', true);
  case NOTIFICATION_REQUESTS_EXPAND_FAIL:
  case NOTIFICATION_REQUESTS_FETCH_FAIL:
    return state.set('isLoading', false);
  case NOTIFICATION_REQUEST_ACCEPT_REQUEST:
  case NOTIFICATION_REQUEST_DISMISS_REQUEST:
    return state.update('items', list => list.filterNot(item => item.get('id') === action.id));
  case NOTIFICATION_REQUEST_FETCH_REQUEST:
    return state.update('current', map => map.set('isLoading', true).set('item', null));
  case NOTIFICATION_REQUEST_FETCH_SUCCESS:
    return state.update('current', map => map.set('isLoading', false).set('item', normalizeRequest(action.request)));
  case NOTIFICATION_REQUEST_FETCH_FAIL:
    return state.update('current', map => map.set('isLoading', false));
  case NOTIFICATIONS_FOR_REQUEST_FETCH_REQUEST:
  case NOTIFICATIONS_FOR_REQUEST_EXPAND_REQUEST:
    return state.setIn(['current', 'notifications', 'isLoading'], true);
  case NOTIFICATIONS_FOR_REQUEST_FETCH_SUCCESS:
    return state.updateIn(['current', 'notifications'], map => map.set('isLoading', false).set('items', ImmutableList(action.notifications.map(notificationToMap))).set('next', action.next));
  case NOTIFICATIONS_FOR_REQUEST_EXPAND_SUCCESS:
    return state.updateIn(['current', 'notifications'], map => map.set('isLoading', false).update('items', list => list.concat(ImmutableList(action.notifications.map(notificationToMap)))).set('next', action.next));
  case NOTIFICATIONS_FOR_REQUEST_FETCH_FAIL:
  case NOTIFICATIONS_FOR_REQUEST_EXPAND_FAIL:
    return state.setIn(['current', 'notifications', 'isLoading'], false);
  default:
    return state;
  }
};
