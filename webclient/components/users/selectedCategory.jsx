import React from 'react';
import CreateCards from './createCards';
import Cookie from 'react-cookie';
import $ from 'jquery';

export default class SuccessfullyRegistered extends React.Component {
  constructor() {
    super();
    this.state = {
      follows: [],
      catagories: [],
      val: true

    };
  }
  // componentWillMount() {
  //   this.getCatagory();
  //  }
   componentDidMount() {
    let emailID = Cookie.load('email');
    // console.log(emailID);
    $.ajax({
      url: '/users/displayCatagory',
      type: 'GET',
      success: function(data1) {
        $.ajax({
      url: '/users/fetchCatagory',
      async: false,
      type: 'POST',
      data: {
        email: emailID
      },
      success: function(data2) {
        // console.log(data1);
        this.setState({follows: data2, catagories: data1});
      }.bind(this),
      error: function() {
      }
    });
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
      this.setState({val: false});
      // console.log('display states',this.state.follows);
   }


  render() {
    return(
        <CreateCards categories={this.state.catagories} email={Cookie.load('email')}
        itemss={this.state.follows} addCategories={this.addCategories.bind(this)}
      profilePic={Cookie.load('profilepicture')} userName={Cookie.load('username')}
       mongo={this.state.val}/>
      );
}
}
