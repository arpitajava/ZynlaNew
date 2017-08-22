import React from 'react';
import MainFollowingCard from './mainFollowingCard.jsx';
import { Grid } from 'semantic-ui-react';

class followingCard extends React.Component {
    constructor () {
        super();
    }
    // static defaultProps = {}


    render () {
        let arr = this.props.followingData.map(function(item, index) {
                return (
              <Grid.Column key ={index}>
                <MainFollowingCard heading={item.profile.name} reputation={item.reputation}
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

module.exports = followingCard;
followingCard.propTypes = {
  followingData: React.PropTypes.array
};
