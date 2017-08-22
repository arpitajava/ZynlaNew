import React from 'react';
import {Button} from 'semantic-ui-react';

class DisplayFavouriteCategoryStructure extends React.Component {
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
        return (
            <div className='buttonPosition'>
                <Button
                   color={this.state.ButtonColor}
                    className='buttonSize'>{this.props.displayImage}</Button>
            </div>
        );
    }
}

DisplayFavouriteCategoryStructure.propTypes = {
    displayImage: React.PropTypes.string.isRequired
};

module.exports = DisplayFavouriteCategoryStructure;
