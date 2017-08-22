import React from 'react';
import Cookie from 'react-cookie';
import FollowingCard from './followingcard';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

import {
   Dimmer,
   Loader
} from 'semantic-ui-react';
class displayFollowing extends React.Component {

  handleOpen = () => this.setState({ active: true })
  handleClose = () => this.setState({ active: false })
   constructor() {
       super();
       this.state = {
         followingObj: []
       };
       this.noFollowingsAlert = this.noFollowingsAlert.bind(this);
     }

     componentWillMount() {
          this.handleOpen();
          this.getFollowing();
     }
     noFollowingsAlert () {
        this.refs.container.error(
          'Not Following anyone',
          '', {
          timeOut: 2000,
          extendedTimeOut: 10000
        });
      }
     getFollowing() {
       let email = Cookie.load('email');
       /* eslint-disable */
       let context = this;
       /* eslint-enable */
       // console.log(email);
         $.ajax({
             url: '/userdoc/getFollowing',
             type: 'POST',
             data: {email: email},
             success: function(data) {
               context.handleClose();
               if(data === 'No Followings') {
                 context.noFollowingsAlert();
               }
               else{
               // console.log(data[0].heading);
               // console.log(data.length);
                 context.setState({followingObj: data});
               }
             },
             error: function() {
              // console.log('error in logout' + err);
             }
         });
     }
   render() {
     const { active } = this.state;
       return (
         <div>
         <Dimmer active={active} page>
         <Loader>Your Followings on the way...</Loader>
       </Dimmer>
       <h1 style={{marginLeft: '10px'}}>Followings</h1>
         <FollowingCard followingData={this.state.followingObj}/>
         <ToastContainer ref='container' style ={{backgroundColor: '#B2242E'}}
                toastMessageFactory={ToastMessageFactory}
                className='toast-top-center' />
       </div>
     );
   }
}
module.exports = displayFollowing;
