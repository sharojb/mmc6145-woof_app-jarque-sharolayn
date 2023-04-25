import * as actions from './actions'


export default function reducer(state, {action, payload}) {
  console.log(state)
  switch(action) {
    case actions.SEARCH_DOGS:
      return {...state, dogSearchResults: payload}
    case actions.ADD_DOG:
      return {...state, favoriteDogs: [...state.favoriteDogs, payload]}
    case actions.REMOVE_DOG:
      return {...state, favoriteDogs: state.favoriteDogs.filter(dog=>dog.name !== payload.name)}
    default:
      return state
  }
}