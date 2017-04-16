import React, { PropTypes } from "react"

import ElizaBot from 'elizabot';
import Conversation from 'chat-template/dist/Conversation';

import styles from "./index.css"

const eliza = new ElizaBot();

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [{
        inbound: true,
        message: eliza.getInitial()
      }]
    };
  }

  keyPress(e) {
    if (e.key === 'Enter' && e.target.value) {
      this.setState({
        messages: [...this.state.messages, {
          message: e.target.value
        }, {
          inbound: true,
          message: eliza.transform(e.target.value)
        }]
      });
      e.target.value = ''; // eslint-disable-line no-param-reassign
    }
  }

  render() {
    return (
      <div>
        <div className={ styles.container } />
        <div className={ styles.conversation } >
          <Conversation messages={this.state.messages} turnOffLoop/>
          <input
            type="text"
            width='100px'
            onKeyPress={this.keyPress.bind(this)}
            placeholder="Type your message here..."
          />
        </div>
      </div>
    )
  }
}

export default ChatPage
