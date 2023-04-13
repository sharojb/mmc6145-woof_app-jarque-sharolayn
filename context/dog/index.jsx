// import {useContext, createContext, useReducer} from 'react'
// import initialState from './state'
// import reducer from './reducer'

// export const dogContext = createContext()

// export const useDogContext = () => {
//   const context = useContext(dogContext)
//   if (context === undefined)
//     throw new Error('useDogContext must be used within DogProvider')
//   return context
// }

// export const DogProvider = (props) => {
//   const [state, dispatch] = useReducer(reducer, initialState)
//   return <dogContext.Provider {...props} value={[state, dispatch]} />
// }

import React, {useContext, createContext, useReducer} from 'react'
import initialState from './state'
import reducer from './reducer'

export const DogContext = createContext()

export const useDogContext = () => {
  const context = useContext(DogContext)
  if (context === undefined)
    throw new Error('useDogContext must be used within a DogProvider')
  return context
}

export const DogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <DogContext.Provider value={[ state, dispatch ]}>
      {children}
    </DogContext.Provider>
  )
}

