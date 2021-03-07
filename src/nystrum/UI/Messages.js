import React from 'react';

function Message (props) {
  return (
    <div
      className='Message'
      style={{
        color: props.color,
        backgroundColor: props.backgroundColor,
        borderColor: props.color,
      }}
    >
      {props.children}
    </div>
  )
}

class Messages extends React.Component {
  render() {
    return (
      <div className="Messages UI">
        <div className='flow-text center'>Messages</div>
        {
          this.props.messages && (
            this.props.messages.map((message, index) => {
              return (
                <Message 
                  key={index} 
                  color={message.type.color}
                  backgroundColor={message.type.backgroundColor}
                >
                  {`${message.text}`}
                </Message>
              )
            })
          )
        }
      </div>
    );
  }
}

export default Messages;