/* eslint-disable complexity */
import React from 'react'
import {connect} from 'react-redux'
import {addTopics, removeTopic} from './client/store/selectedTopics'
import {addTopic} from './client/store/topics'
import {addTarget, removeTarget} from './client/store/targets'
import socket from './client/socket'

const validBases = 'ACGT'
// could include >.X+*()/\

class Consumer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectTopics: [],
      createTopic: '',
      removeTopic: '',
      newTarget: '',
      removeTarget: '',
      inputMessage: '',
      description: ''
    }
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
    } else if (e.target.name === 'newTarget') {
      const inputSequence = e.target.value.toUpperCase()
      const lastBase = inputSequence[inputSequence.length - 1] || ''
      if (validBases.includes(lastBase)) {
        value = inputSequence
      } else {
        value = this.state.newTarget
        this.setState({inputMessage: `Invalid base: ${lastBase}`})
        setTimeout(() => this.setState({inputMessage: ''}), 2000)
      }
    } else if (e.target.name === 'description') {
      value = e.target.value
    } else if (e.target.name === 'removeTarget') {
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
    } else if (e.target.name === 'add-target') {
      if (!this.props.targets.includes(e.target.newTarget.value)) {
        this.props.addTarget({
          sequence: e.target.newTarget.value,
          description: e.target.description.value
        })
        socket.emit('addTarget', {
          sequence: e.target.newTarget.value,
          description: e.target.description.value
        })
        this.setState({newTarget: '', description: ''})
      } else {
        this.setState({inputMessage: 'Target already exists'})
      }
    } else if (e.target.name === 'remove-target') {
      this.props.removeTarget(this.state.removeTarget)
      socket.emit('removeTarget', {target: this.state.removeTarget})
    }
  }

  render() {
    const {users, topics, selectedTopics, targets} = this.props
    const {createTopic, selectTopics, inputMessage} = this.state
    return (
      <div>
        <div id="panel">
          <div className="area">
            <div id="topics">
              {selectedTopics.length ? (
                <div className="target-header">Topics:</div>
              ) : (
                <div className="target-header">
                  Please select topic(s) to listen for
                </div>
              )}
              <div>{selectedTopics.join(', ')}</div>
            </div>

            <div className="forms">
              <form
                name="add-topic"
                className="add"
                onSubmit={this.handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="selectTopics">
                    Select existing topic(s):
                  </label>
                  <select
                    multiple
                    name="selectTopics"
                    onChange={this.handleChange}
                  >
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
                    autoComplete="off"
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
                  <div className="required">
                    Already listening for that topic
                  </div>
                ) : null}
              </form>
              <form
                name="remove-topic"
                className="remove"
                onSubmit={this.handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="removeTopic">Remove topic:</label>
                  <select name="removeTopic" onChange={this.handleChange}>
                    <option />
                    {selectedTopics.map(topic => (
                      <option key={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={!this.state.removeTopic.length}>
                  Remove topic
                </button>
              </form>
            </div>
          </div>
          <div className="area">
            {targets.length ? (
              <div id="targets">
                <div className="target-col">
                  <div className="target-header">Targets:</div>
                  <div>
                    {targets.map(target => (
                      <div key={target.sequence} className="target">
                        <div>{target.sequence}:</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div id="spacer" />
                <div className="target-col" id="descriptions">
                  <div className="target-header">Descriptions:</div>
                  <div>
                    {targets.map(target => (
                      <div key={target.description} className="target">
                        <div>
                          <em>
                            {target.description.length
                              ? target.description
                              : 'no description'}
                          </em>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="target-header" id="targets">
                Please enter target sequence(s) to match
              </div>
            )}
            <div className="forms">
              <form
                id="add-target"
                name="add-target"
                onSubmit={this.handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="newTarget" className="container">
                    Enter new target sequence:
                  </label>
                  <input
                    type="text"
                    name="newTarget"
                    onChange={this.handleChange}
                    value={this.state.newTarget}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="container">
                    Description:
                  </label>
                  <input
                    type="text"
                    name="description"
                    onChange={this.handleChange}
                    value={this.state.description}
                    autoComplete="off"
                  />
                </div>
                <div id="inputMessage">{inputMessage}</div>
                <div id="filters">
                  <div className="filter">
                    <label className="filter-label container">
                      Antisense
                      <input type="checkbox" />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="filter">
                    <label className="filter-label container">
                      Point mutations
                      <input type="checkbox" />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="filter">
                    <label className="filter-label container">
                      Insertions
                      <input type="checkbox" />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="filter">
                    <label className="filter-label container">
                      Deletions
                      <input type="checkbox" />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="filter">
                    <label className="filter-label container">
                      Count tandem repeats
                      <input type="checkbox" />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="filter">
                    <label className="filter-label container">
                      Translate amino acid
                      <input type="checkbox" />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={!this.state.newTarget.length}>
                  Add target
                </button>
              </form>
              <form
                name="remove-target"
                className="remove"
                onSubmit={this.handleSubmit}
              >
                <div className="form-group">
                  <label htmlFor="removeTarget">Remove target:</label>
                  <select name="removeTarget" onChange={this.handleChange}>
                    <option />
                    {targets.map(target => (
                      <option key={target.sequence}>{target.sequence}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={!this.state.removeTarget.length}
                >
                  Remove target
                </button>
              </form>
            </div>
          </div>
        </div>
        {Object.keys(users).map(userId => {
          const {sequence, matches} = users[userId]
          return (
            <div key={userId} className="user-container">
              <div>Sequence ID: {userId}</div>
              <div className="sequence">
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
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = ({users, topics, selectedTopics, targets}) => ({
  users,
  topics,
  selectedTopics,
  targets
})

const mapDispatchToProps = {
  addTopics,
  addTopic,
  removeTopic,
  addTarget,
  removeTarget
}

export default connect(mapStateToProps, mapDispatchToProps)(Consumer)
