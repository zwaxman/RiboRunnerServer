// import axios from 'axios'
// import history from '../history'

// /**
//  * ACTION TYPES
//  */
// const ADD_MATCH = 'ADD_MATCH'

// /**
//  * INITIAL STATE
//  */
// const initialState = []

// /**
//  * ACTION CREATORS
//  */
// export const addMatch = match => ({type: ADD_MATCH, match})

// /**
//  * THUNK CREATORS
//  */
// // export const receivedBase = base => dispatch => {
// //   try {
// //       console.log(base)
// //     dispatch(addBase(base))
// //   } catch (err) {
// //     console.error(err)
// //   }
// // }

// /**
//  * REDUCER
//  */
// export default function(state = initialState, action) {
//   switch (action.type) {
//     case ADD_MATCH: {
//         const sameTarget = state.find(match => match.target===action.match.target)
//         if (sameTarget) {
//             return [...state.filter(match => match.target!==action.match.target), {...sameTarget, indices: [...sameTarget.indices, action.match.index]}]
//         } else {
//             return [...state, {target: action.match.target, indices: [action.match.index]}]
//         }
//     }
//     default:
//       return state
//   }
// }
