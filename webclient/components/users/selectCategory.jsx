import React from 'react';
import CreateCards from './createCards';
import Cookie from 'react-cookie';
import $ from 'jquery';

export default class SuccessfullyRegistered extends React.Component {
  constructor() {
    super();
    this.state = {
      follows: [],
      catagories: []
    };
  }
  // componentWillMount() {
  //   this.getCatagory();
  //  }
   componentDidMount() {
    $.ajax({
      url: '/users/displayCatagory',
      type: 'GET',
      success: function(data) {
        this.setState({catagories: data});
      }.bind(this),
      error: function() {
      }
    });
   }

   addCategories(items, category)
   {
    // console.log('getting items from createcards',items);
      this.setState({follows: items});
      this.setState({catagories: category});
      // this.setState({mongoCategory: mongoCategory});
      // console.log('display states',this.state.follows);
   }


  render() {
    return(
        <CreateCards categories={this.state.catagories} email={Cookie.load('email')}
        itemss={this.state.follows} addCategories={this.addCategories.bind(this)}
      profilePic={Cookie.load('profilepicture')} userName={Cookie.load('username')}
      mongo={false}/>
      );
}
}
