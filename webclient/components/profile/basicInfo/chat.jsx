import React from 'react';
import ChatCard from './chatcard';
import { Grid } from 'semantic-ui-react';
class Chat extends React.Component {
  constructor() {
    super();
  }

  render() {
    /* eslint-disable */
    let data = this.props.chat.map(function(item){
    /* eslint-enable */
      return (
        <Grid.Column>
        <ChatCard data = {item}/>
        </Grid.Column>
      );
    });
    return (
      <Grid columns = {1}>
        {data}
      </Grid>
    );
  }
}

module.exports = Chat;
