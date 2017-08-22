import React from 'react';

import {
   Grid,
   Card,
   Icon,
   Menu
} from 'semantic-ui-react';

class mainQuestionCard extends React.Component {

   constructor() {
       super();
     }
   render() {
     let dateData = new Date(parseInt(this.props.addedOn, 10)).toString().substring(0, 15);
     let arr = this.props.category;
     let arr1 = arr.replace('["', ' ');
     let arr2 = arr1.replace('"]', ' ');
     let tags = arr2.replace('","', ' >> ');
       return (
         <div>
            <Grid divided='vertically'>
                <Grid.Row columns={2}>
                    <Grid.Column width={14}>
                        <div>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>
                                         {this.props.heading}
                                    </Card.Header>
                                    <Card.Description className='ansWidth'>
                                      {tags}
                                    </Card.Description>
                                </Card.Content>
                                   <Menu>
                                        <Menu.Item>
                                            <Icon name='thumbs up' color='green' size='large'/>
                                            {this.props.upVote}
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Icon name='thumbs down' color='red' size='large'/>
                                            {this.props.downVote}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {this.props.acceptedCount}&nbsp;&nbsp;Accepted
                                                </Menu.Item>
                                                <Menu.Item>
                                                    Added On: {dateData}
                                                </Menu.Item>
                                    </Menu>
                               </Card>
                        </div>

                    </Grid.Column>
                    <Grid.Column width={2}/>
                </Grid.Row>
            </Grid>
            </div>

       );
   }
}
module.exports = mainQuestionCard;
mainQuestionCard.propTypes = {
  heading: React.PropTypes.string,
  category: React.PropTypes.string,
  acceptedCount: React.PropTypes.string,
  upVote: React.PropTypes.number,
  downVote: React.PropTypes.number,
  addedOn: React.PropTypes.string
};
