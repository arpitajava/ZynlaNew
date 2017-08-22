import React from 'react';

import {
   Grid,
   Card
} from 'semantic-ui-react';
class mainInterestCard extends React.Component {

   constructor() {
       super();
     }

   render() {
       return (
         <div>
            <Grid divided='vertically'>
                <Grid.Row columns={3}>
                    <Grid.Column width={2}/>
                    <Grid.Column width={10}>
                        <div>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>
                                         {this.props.heading}
                                    </Card.Header>
                                </Card.Content>
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
module.exports = mainInterestCard;
mainInterestCard.propTypes = {
  heading: React.PropTypes.string
};
