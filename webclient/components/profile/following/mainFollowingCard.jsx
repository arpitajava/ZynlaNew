import React from 'react';
import { Button, Card, Image, Segment, Popup} from 'semantic-ui-react';

let headerStyle = {
  marginLeft: '30%',
  fontSize: '30px',
  fontFamily: 'Serif',
  color: '#B2242E',
  cursor: 'pointer'
};
let descStyle = {
  marginLeft: '20%',
  marginTop: '2%',
  lineHeight: '20px',
  fontSize: '15px',
  letterSpacing: '2px'
};
let cardStyle = {
  width: '100%'

};
class mainFollowingCard extends React.Component {
  constructor() {
      super();
      this.state = {
        content: '',
        isOpen: false
      };
    }
    hoverCard() {
      let temp;
      temp = (
        <Card raised='true' style={cardStyle}>
          <Card.Content>
            <Image floated='left' size='small'
              src={this.props.image}/>
            <Card.Header style={headerStyle}>
              {this.props.heading}
            </Card.Header>
            <Card.Meta style = {{marginLeft: '45%'}}>
              From {this.props.city}
            </Card.Meta>
            <div style={descStyle}>
              <strong> {this.props.description} </strong>
            </div>
          </Card.Content>
            <Card.Content extra>
              <Button style = {{marginLeft: '10%'}} className='butstyle' content='Following'
                                             icon='fork' label={{
                                               basic: true,
                                               color: 'white',
                                               pointing: 'left',
                                               content: this.props.followingCount
                                           }}/>
              <Button content='Followers' className='butstyle'
                                             icon='fork' label={{
                                               basic: true,
                                               color: 'white',
                                               pointing: 'left',
                                               content: this.props.followerCount
                                           }}/>
            </Card.Content>

            </Card>

      );
      this.setState({
        content: temp,
        isOpen: true

      });
    }
    removeHover() {
      this.setState({
        content: ''
      });
    }
    render() {
        return (


                <Popup flowing trigger = {<div>
                    <Segment>
                   <Image floated='left' size='tiny'
                     shape='circular' src={this.props.image}/>
                        <h1 style={headerStyle}>{this.props.heading}</h1>
                        <h3 style={{marginTop: '-5px', marginLeft: '40%',
                          color: 'lightgrey', fontSize: '15px'}}>
                          Reputation: {this.props.reputation}</h3>
                        <Button content='Un follow' style={{marginLeft: '60%'}}
                          className='butstyle' icon='fork' />
                      </Segment> </div>} hoverable onOpen={this.hoverCard.bind(this)}
                      style = {{width: '35%'}}>
                {this.state.content}
                </Popup>
);
}
}
mainFollowingCard.propTypes = {
  image: React.PropTypes.string,
  heading: React.PropTypes.string,
  city: React.PropTypes.string,
  description: React.PropTypes.string,
  followingCount: React.PropTypes.number,
  followerCount: React.PropTypes.number,
  reputation: React.PropTypes.number
  };
module.exports = mainFollowingCard;
