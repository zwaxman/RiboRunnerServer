/**
 * ACTION TYPES
 */
const ADD_TOPICS = 'ADD_TOPICS'
const REMOVE_TOPIC = 'REMOVE_TOPIC'

/**
 * INITIAL STATE
 */
const initialState = []

/**
 * ACTION CREATORS
 */
export const addTopics = topics => ({
  type: ADD_TOPICS,
  topics: typeof topics === 'object' ? topics : [topics]
})
export const removeTopic = topic => ({type: REMOVE_TOPIC, topic})

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
    case ADD_TOPICS:
      return [...state, ...action.topics].sort()
    case REMOVE_TOPIC:
      return state.filter(topic => topic !== action.topic)
    default:
      return state
  }
}
