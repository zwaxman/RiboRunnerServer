import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const ADD_BASE = 'ADD_BASE'
const ADD_MATCH = 'ADD_MATCH'
const HIGHLIGHT_MATCH = 'HIGHLIGHT_MATCH'

/**
 * INITIAL STATE
 */
const initialState = {}

/**
 * ACTION CREATORS
 */
export const addBase = data => ({type: ADD_BASE, data})
export const addMatch = data => ({type: ADD_MATCH, data})
export const highlightMatch = match => ({type: HIGHLIGHT_MATCH, match})

/**
 * THUNK CREATORS
 */
// export const receivedBase = base => dispatch => {
//   try {
//       console.log(base)
//     dispatch(addBase(base))
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_BASE: {
      const {userId, base} = action.data
      if (!state[userId]) {
        return {
          ...state,
          [userId]: {matches: [], sequence: [{base, match: false}]}
        }
      } else {
        return {
          ...state,
          [userId]: {
            ...state[userId],
            sequence: [...state[userId].sequence, {base, match: false}]
          }
        }
      }
      // const sameUser = state.find(user => user.userId===action.data.userId)
      // if (sameUser) {
      //     return [...state.filter(user => user.userId!==action.data.userId), {...sameUser, sequence: [...sameUser.sequence, action.data.base]}]
      // } else {
      //     return [...state, {userId: action.data.userId, sequence: [action.data.base]}]
      // }
    }
    case ADD_MATCH: {
      const {userId, index, target} = action.data
      const newSequence = [...state[userId].sequence]
      for (let i = index; i < index + target.length; i++) {
        newSequence[i].match = true
      }
      return {
        ...state,
        [userId]: {
          sequence: newSequence,
          matches: [...state[userId].matches, index]
        }
      }
      // return state.map(user => {
      //     if (user.userId===action.data.userId) {
      //         const newSequence = [...user.sequence]
      //         newSequence[action.data.index] = `<strong class='match>${newSequence[action.data.index]}</strong>`
      //         return {...user, sequence: newSequence}
      //     } else {
      //         return user
      //     }
      // })
    }
    // case HIGHLIGHT_MATCH:
    //     return state.slice(0, state.length-action.match.target.length+1)+`<strong class='match'>${action.match.target})</strong>`
    default:
      return state
  }
}
