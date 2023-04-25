import React, {useContext, createContext, useReducer} from 'react'
import initialState from './state'
import reducer from './reducer'
import useFavorites from '../../hooks/useFavorites'

export const DogContext = createContext()

export const useDogContext = () => {
  const context = useContext(DogContext)
  if (context === undefined)
    throw new Error('useDogContext must be used within a DogProvider')
  return context
}

export const DogProvider = ({ children }) => {
  console.log(initialState)
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log(state)
  return (
    <DogContext.Provider value={[ state, dispatch ]}>
      {children}
    </DogContext.Provider>
  )
}

