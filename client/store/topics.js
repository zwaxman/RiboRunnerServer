/**
 * ACTION TYPES
 */
const SET_TOPICS = 'SET_TOPICS'
const ADD_TOPIC = 'ADD_TOPIC'

/**
 * INITIAL STATE
 */
const initialState = []

/**
 * ACTION CREATORS
 */
export const setTopics = topics => ({type: SET_TOPICS, topics})
export const addTopic = topic => ({type: ADD_TOPIC, topic})

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
    case SET_TOPICS:
      return action.topics.sort()
    case ADD_TOPIC:
      return [...state, action.topic].sort()
    default:
      return state
  }
}
