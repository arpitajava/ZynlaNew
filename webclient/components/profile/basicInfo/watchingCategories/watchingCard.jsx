import React from 'react';
import MainWatchingCard from './mainWatchingCard.jsx';
import { Grid } from 'semantic-ui-react';
class interestsCard extends React.Component {
    constructor () {
        super();
    }
    // static defaultProps = {}


    render () {
        let arr = this.props.watchingData.map(function(item, index) {
                return (
            <Grid.Column key = {index}>
                <MainWatchingCard heading={item}/>
            </Grid.Column>
            );
        });
        return(
          <Grid columns = {3}>
            {arr}
          </Grid>
        );
      }
}

module.exports = interestsCard;
interestsCard.propTypes = {
  watchingData: React.PropTypes.array
};
