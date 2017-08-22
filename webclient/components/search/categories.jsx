import React from 'react';
import {Grid, Menu} from 'semantic-ui-react';

class Category extends React.Component {
  constructor() {
    super();
  }
// on click method to change the component using a parent function
  people() {
    /* eslint-disable */
    this.props.changeComponent('people');
    /* eslint-enable */
  }
// on click method to change the component using a parent function
  questions() {
    /* eslint-disable */
    this.props.changeComponent('questions');
    /* eslint-enable */
  }

  render() {
    return (
      <div className = 'menudiv'>
        <Grid centered className='arrowsize1' style={{marginLeft: -270 + 'px',
         marginTop: 20 + 'px', marginBottom: 50 + 'px'}}>
        <Menu color={'red'} stackable centered inverted widths={2}
         className='Menu' style={{width: 550 + 'px', fontSize: 15 + 'px'}}>
        <Menu.Item name='Questions' onClick = {this.questions.bind(this)} />
        <Menu.Item name='People' onClick = {this.people.bind(this)} />
      </Menu>
        </Grid>
      </div>
    );
  }
}

module.exports = Category;
