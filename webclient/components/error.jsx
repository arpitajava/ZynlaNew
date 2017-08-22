import React from 'react';
import { Header, Icon, Button } from 'semantic-ui-react';

class Error extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='settings' />
          <Header.Content>
            Please Login or Signup to continue.
          </Header.Content>
        </Header>
        <a href = "/#/">
          <Button teal>Login/Signup</Button>
        </a>
      </div>
    );
  }
}

module.exports = Error;
