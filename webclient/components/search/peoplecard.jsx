import React from 'react';
import {Button, Image, Card} from 'semantic-ui-react';
import $ from 'jquery';
import Cookie from 'react-cookie';

class PeopleCard extends React.Component {
  constructor() {
    super();
    this.state = {
      follow: 'Follow'
    };
  }
// before component is mounted this checks for the Fallow status of the user
  componentDidMount() {
    /* eslint-disable */
    if(this.props.follow) {
      this.setState({
        follow: 'Following'
      });
    }
    else {
      this.setState({
        follow: 'Follow'
      });
    }
    /* eslint-enable */
  }
// function to make user fallow to other user
  handleFollow() {
    let emailId = Cookie.load('email');
    if(this.state.follow === 'Following') {
      return 0;
    }
    $.ajax({
        url: '/search/followuser',
        type: 'POST',
        data: {
          id: emailId,
          /*eslint-disable */
          emailId: this.props.id
          /* eslint-enable */
        },
        success: function() {
          this.setState({follow: 'Following'});
        }.bind(this)
      });
      return 1;
  }

 render() {
          //  console.log('image from peoplecard '+this.props.photo);
          //  console.log((this.props.photo))
     return (

       /* eslint-disable */
        <Card>
    <Image className = 'peopleimage' src= {this.props.photo} alt='Profile Image'/>

    <Card.Content>{this.props.id}</Card.Content>
    <Card.Content extra>
    <Button fluid color = 'red' onClick = {this.handleFollow.bind(this)}>{this.state.follow}</Button>
</Card.Content>
  </Card>
        /* eslint-enable */
      );
  }
}

module.exports = PeopleCard;
