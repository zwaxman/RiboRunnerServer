import React from 'react'
import {connect} from 'react-redux'
import user from './client/store/user'

const Consumer = props => {
  const {users} = props
  return (
    <div>
      {Object.keys(props.users).map(userId => {
        const {sequence} = users[userId]
        return (
          <div key={userId}>
            {sequence.map(
              (base, i) =>
                base.match ? (
                  <span key={i} className="match">
                    {base.base}
                  </span>
                ) : (
                  base.base
                )
            )}
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = ({users}) => ({users})

export default connect(mapStateToProps)(Consumer)
