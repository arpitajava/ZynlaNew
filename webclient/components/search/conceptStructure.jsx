import React from 'react';
import {Button} from 'semantic-ui-react';
import {Link} from 'react-router';

class ConceptStructure extends React.Component {
    constructor() {
        super();
        this.state = {
          ButtonColor: 'teal'
        };
    }
    componentDidMount() {
      this.changeColor();
    }

    changeColor() {
      let colorsArray = [
          'teal',
          'violet',
          'olive',
          'green',
          'purple',
          'yellow',
          'orange',
          'red',
          'pink',
          'blue'
      ];
      let randomNumber = Math.floor(Math.random() * colorsArray.length);
      this.setState({ButtonColor: colorsArray[randomNumber]});
    }
 render() {
      return(
        /* eslint-disable */
        <div>
          <Link to = {'/search?question=' + this.props.conceptName}>
            <Button color={this.state.ButtonColor} style={{height: 51 + 'px', width: 105 + 'px'}} >{this.props.conceptName}</Button>
          </Link>
        </div>
        /* eslint-enable */
      );
    }
}
ConceptStructure.propTypes = {
   displayImage: React.PropTypes.string
 };

module.exports = ConceptStructure;
