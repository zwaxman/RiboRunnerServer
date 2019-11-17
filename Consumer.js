import React from 'react'
import {connect} from 'react-redux'
import {addTopics, removeTopic} from './client/store/selectedTopics'
import {addTopic} from './client/store/topics'
import socket from './client/socket'

class Consumer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {selectTopics: [], createTopic: '', removeTopic: ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    let value
    if (e.target.name === 'selectTopics') {
      this.setState({createTopic: ''})
      value = [...e.target.options].filter(o => o.selected).map(o => o.value)
    } else if (e.target.name === 'createTopic') {
      this.setState({selectTopics: []})
      value = e.target.value
    } else if (e.target.name === 'removeTopic') {
      value = e.target.value
    }
    this.setState({[e.target.name]: value})
  }

  handleSubmit(e) {
    e.preventDefault()
    if (e.target.name === 'add-topic') {
      let topics
      const {selectTopics, createTopic} = this.state
      if (selectTopics.length) {
        topics = selectTopics
      } else if (this.props.selectedTopics.includes(createTopic)) {
        return
      } else if (this.props.topics.includes(createTopic)) {
        topics = createTopic
      } else {
        topics = createTopic
        this.props.addTopic(topics)
        socket.emit('createTopic', {topics})
      }
      this.props.addTopics(topics)
      socket.emit('addTopics', {topics})
      this.setState({createTopic: '', selectTopics: []})
    } else if (e.target.name === 'remove-topic') {
      this.props.removeTopic(this.state.removeTopic)
      socket.emit('removeTopic', {topic: this.state.removeTopic})
    }
  }

  render() {
    const {users, topics, selectedTopics} = this.props
    const {createTopic, selectTopics} = this.state
    return (
      <div>
        {selectedTopics.length ? (
          <div>Listening for topics: {selectedTopics.join(', ')}</div>
        ) : (
          <div>Please select topic(s) to listen for</div>
        )}
        <div id="topic-area">
          <form name="add-topic" id="add-topic" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="selectTopics">Select existing topic(s):</label>
              <select multiple name="selectTopics" onChange={this.handleChange}>
                {topics
                  .filter(topic => !selectedTopics.includes(topic))
                  .map(topic => (
                    <option key={topic} selected={selectTopics === topic}>
                      {topic}
                    </option>
                  ))}
              </select>
            </div>
            <div>-or-</div>
            <div className="form-group">
              <label htmlFor="createTopic">Create new topic:</label>
              <input
                type="text"
                name="createTopic"
                value={createTopic}
                onChange={this.handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={!createTopic.length && !selectTopics.length}
            >
              Add topic(s)
            </button>
            {selectTopics.length || createTopic.length ? null : (
              <div className="required">
                Please select topic(s) to listen for
              </div>
            )}
            {selectedTopics.includes(createTopic) ? (
              <div className="required">Already listening for that topic</div>
            ) : null}
          </form>
          <div>
            <form
              name="remove-topic"
              id="remove-topic"
              onSubmit={this.handleSubmit}
            >
              <select name="removeTopic" onChange={this.handleChange}>
                <option />
                {selectedTopics.map(topic => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>
              <button type="submit" disabled={!this.state.removeTopic.length}>
                Remove topic
              </button>
            </form>
          </div>
        </div>
        {Object.keys(users).map(userId => {
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
}

const mapStateToProps = ({users, topics, selectedTopics}) => ({
  users,
  topics,
  selectedTopics
})

const mapDispatchToProps = {addTopics, addTopic, removeTopic}

export default connect(mapStateToProps, mapDispatchToProps)(Consumer)
