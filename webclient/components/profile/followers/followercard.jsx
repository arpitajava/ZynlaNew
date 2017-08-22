import React from 'react';
import MainFollowerCard from './mainFollowerCard.jsx';
import { Grid } from 'semantic-ui-react';

class followerCard extends React.Component {
    constructor () {
        super();
    }
    // static defaultProps = {}


    render () {
        let arr = this.props.followerData.map(function(item, index) {
                return (
              <Grid.Column key ={index}>
                <MainFollowerCard heading={item.profile.name} reputation={item.reputation}
                  city={item.profile.address.city}
                image={item.profile.picture} description= {item.profile.description} followerCount=
              {item.followerCount} followingCount = {item.followingUser.length}/>
            </Grid.Column>
            );
        });
        return(
          <Grid columns={2}>
            {arr}
        </Grid>
        );
      }
}

module.exports = followerCard;
followerCard.propTypes = {
  followerData: React.PropTypes.array
};
