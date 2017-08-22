import React from 'react';
import DisplayFavouriteCategoryStructure from './displayFavouriteCategoryStructure.jsx';
import {Grid, Icon} from 'semantic-ui-react';
class DisplayFavouriteCategory extends React.Component {
    constructor() {
        super();
        this.state = {
            start: 0,
            end: 3
        };
    }
    /* Favourite category maximum 4 display by right side Click*/
    changeStartRight() {
        let start;
        let end;
        if (this.state.start + 4 > this.props.json.length) {
            start = 0;
            end = 0;
        } else {
            start = this.state.start + 4;
        }
        if (this.state.end + 4 > this.props.json.length) {
            end = this.props.json.length;
        } else {
            end = this.state.end + 4;
        }
        if (start === 0) {
            end = 3;
          }
        this.setState({start: start, end: end});
    }
    /* Favourite category maximum 4 display by left side Click*/
    changeStartLeft() {
       let start;
       let end;
       if (this.state.start - 4 < 0) {
           start = 0;
           end = 0;
       } else {
           start = this.state.start - 4;
       }
       if (this.state.end - 4 < 3) {
           end = 3;
       } else {
           end = this.state.end - 4;
       }
       if (start === 0) {
           end = 3;
         }
       this.setState({start: start, end: end});
   }

    render() {
        let displayImage = [];
        for (let i = this.state.start; i <= this.state.end; i = i + 1) {
            if (typeof this.props.json[i] !== 'undefined') {
                displayImage.push(this.props.json[i]);
            }
        }
        let Data = displayImage.map(function(item) {
          // console.log("item:"+item);
            return (
                <Grid.Column>
                    <DisplayFavouriteCategoryStructure displayImage={item}/>
                </Grid.Column>
            );
        });
        return (
          <div>
            <Grid>
                <Grid.Column width={1} className='arrowsizeLeft'>
                    <Icon name='chevron left' onClick={this.changeStartLeft.bind(this)}/>
                </Grid.Column>
                <Grid.Column width={10} >
                    <Grid columns={4} >
                        {Data}
                    </Grid>
                </Grid.Column>
                <Grid.Column width={2} className='arrowsizeRight'>
                    <Icon name='chevron right' onClick={this.changeStartRight.bind(this)}/>
                </Grid.Column>
            </Grid>
          </div>
        );
    }
  }
  DisplayFavouriteCategory .propTypes = {
   json: React.PropTypes.array
 };
  module.exports = DisplayFavouriteCategory;
