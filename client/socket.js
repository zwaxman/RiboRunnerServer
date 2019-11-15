import io from 'socket.io-client'
import {addBase, addMatch} from './store/users'
import store from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('sendBase', data => {
  store.dispatch(addBase(data))
})

socket.on('sendMatch', match => {
  store.dispatch(addMatch(match))
  // store.dispatch(highlightMatch(match))
})

export default socket
