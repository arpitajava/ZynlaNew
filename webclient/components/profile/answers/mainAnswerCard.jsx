import React from 'react';
import {
    Grid,
    Card,
    Icon,
    Menu
} from 'semantic-ui-react';

let cardStyle = {
  width: '90%'
};

let commentStyle = {
    fontFamily: 'Cochin',
    fontSize: 18
};
class mainAnswerCard extends React.Component {

   constructor() {
       super();
     }

   render() {
     let ansHtmlContent = this.props.answer;
     let dateData = new Date(parseInt(this.props.addedOn, 10)).toString().substring(0, 15);
       return (
         <div>
             <Grid divided='vertically'>
                 <Grid.Row columns={2}>
                     <Grid.Column width={14}>
                         <div>
                             <Card fluid style={cardStyle}>
                                 <Card.Content>
                                     <Card.Header>
                                        <div dangerouslySetInnerHTML={{__html: ansHtmlContent}}/>
                                     </Card.Header>
                                 </Card.Content>
                                 <Menu style={commentStyle}>
                                     <Menu.Item>
                                         <Icon name='thumbs up' size='large' color='green'/>
                                         {this.props.upVote}
                                     </Menu.Item>
                                     <Menu.Item>
                                         <Icon name='thumbs down' size='large' color='red'/>
                                         {this.props.downVote}
                                     </Menu.Item>
                                         <Menu.Item>
                                             Added On: {dateData}
                                         </Menu.Item>
                                 </Menu>
                             </Card>
                         </div>
                     </Grid.Column>

                 </Grid.Row>
             </Grid>
           </div>
       );
   }
}
module.exports = mainAnswerCard;
mainAnswerCard.propTypes = {
  answer: React.PropTypes.string,
  upVote: React.PropTypes.number,
  downVote: React.PropTypes.number,
  addedOn: React.PropTypes.string
};
