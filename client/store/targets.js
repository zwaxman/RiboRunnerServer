/**
 * ACTION TYPES
 */
const ADD_TARGET = 'ADD_TARGET'
const REMOVE_TARGET = 'REMOVE_TARGET'
const SET_TARGETS = 'SET_TARGETS'

/**
 * INITIAL STATE
 */
const initialState = []

/**
 * ACTION CREATORS
 */
export const addTarget = target => ({
  type: ADD_TARGET,
  target
})
export const removeTarget = target => ({type: REMOVE_TARGET, target})
export const setTargets = targets => ({type: SET_TARGETS, targets})

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
    case ADD_TARGET:
      return [...state, action.target].sort(
        (A, B) => (A.sequence > B.sequence ? 1 : -1)
      )
    case REMOVE_TARGET:
      return state.filter(target => target.sequence !== action.target)
    case SET_TARGETS:
      return state.filter(target => target.sequence !== action.target)
    default:
      return state
  }
}
