import * as actions from './actions'

export default function reducer(state, {action, payload}) {
  switch(action) {
    case actions.SEARCH_DOGS:
      return {...state, dogSearchResults: payload}
    default:
      return state
  }
}