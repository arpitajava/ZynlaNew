import React from 'react';
import Cookie from 'react-cookie';
import FollowerCard from './followercard';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

import {
   Dimmer,
   Loader
} from 'semantic-ui-react';
class displayFollower extends React.Component {

  handleOpen = () => this.setState({ active: true })
  handleClose = () => this.setState({ active: false })
   constructor() {
       super();
       this.state = {
         followerObj: []
       };
       this.noFollowersAlert = this.noFollowersAlert.bind(this);
     }

     componentWillMount() {
          this.handleOpen();
          this.getFollower();
     }
     noFollowersAlert () {
        this.refs.container.error(
          'No Followers',
          '', {
          timeOut: 2000,
          extendedTimeOut: 10000
        });
      }
     getFollower() {
       let email = Cookie.load('email');
       // console.log(email);
       /* eslint-disable */
       let context = this;
       /* eslint-enable*/
         $.ajax({
             url: '/userdoc/getFollowers',
             type: 'POST',
             data: {email: email, skip: 0, limit: 10},
             success: function(data) {
                 context.handleClose();
                //  console.log(data);
               if(data.length === 0) {
                 context.noFollowersAlert();
               }
               else {
               // console.log(data[0].header);
               // console.log(data.length);
                 context.setState({followerObj: data});
               }
             },
             error: function() {
                   context.handleClose();
               context.noFollowersAlert();
              // console.log('error in logout' + err);
             }
         });
     }
   render() {
     const { active } = this.state;
       return (
         <div>
         <Dimmer active={active} page>
         <Loader>Your Followers on the way..</Loader>
       </Dimmer>
       <h1>Followers</h1>
         <FollowerCard followerData={this.state.followerObj}/>
         <ToastContainer ref='container' style ={{backgroundColor: '#B2242E'}}
                toastMessageFactory={ToastMessageFactory}
                className='toast-top-center' />
       </div>
     );
   }
}
module.exports = displayFollower;
