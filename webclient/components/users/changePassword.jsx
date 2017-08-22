let React = require('react');
let {hashHistory} = require('react-router');
import {Button, Grid, Icon, Form, Segment } from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
// import validator from 'validator';
// import graph from 'fbgraph';
import $ from 'jquery';
// const ReactToastr = require('react-toastr');
// const {ToastContainer} = ReactToastr;
// const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class ChangePassword extends React.Component {
   constructor() {
       super();
       this.state =
       {
        open: true
        };
      this.changePassword = this.changePassword.bind(this);
      this.locAlert = this.locAlert.bind(this);
      this.locAlertError = this.locAlertError.bind(this);
   }
    locAlert () {
        this.refs.container.success(
          'Password Updated Successfully',
          '', {
          timeOut: 1000,
          extendedTimeOut: 10000
        });
      }
      locAlertError () {
        this.refs.container.error(
          'Password Missmatch',
          '', {
          timeOut: 1000,
          extendedTimeOut: 10000
        });
      }
    changePassword(e, value) {
        e.preventDefault();
        /* eslint-disable*/
        let context = this;
        /* eslint-enable*/
        if(value.formData.newPass === value.formData.confPass)
        {
          $.ajax({
                url: '/users/changePassword',
                type: 'POST',
                data: {
                    newPass: value.formData.newPass,
                    email: window.location.hash.split('emailId=')[1]
                },
                success: function() {
                    context.locAlert();
                    hashHistory.push('/');
                },
                error: function() {
                  // console.log(err);
                    // this.setState({openSnackbar: true, snackbarMsg: err.responseText});
                }
            });
        }
        else
        {
          context.locAlertError();
        }
    }

render() {
  return (
    <div className="overlay">
      <img src="./../../image/Zynla.png"
       className="imagePosition" style = {{marginLeft: 600 + 'px'}}/>
      <p className="tagline"
       style={{marginLeft: 541 + 'px'}}>
       A place to share knowledge and better understand the world</p>
  <div className="centerPosition">
<Segment compact style = {{marginLeft: -24 + 'px'}}>
  <Grid centered >
       <Form onSubmit={this.changePassword} className="contentCenter">
            <Form.Field>
            <Form.Input type='password' name= "newPass" placeholder= 'New Password' icon='lock'
            iconPosition='left' id="formstyle"
             required />
            </Form.Field>

            <Form.Field><br/>
            <Form.Input type='password' name="confPass" placeholder='Confirm Password'
            icon='lock' iconPosition='left' id="formstyle" required/>
            </Form.Field><br/>

            <Button color='teal' circular>
            <Button.Content type='submit' ><Icon name='sign in'/>Change Password</Button.Content>
            </Button><br/><br/>

       </Form>
       </Grid>
</Segment>
  </div>
  <ToastContainer ref='container' toastMessageFactory={ToastMessageFactory}
                       className='toast-top-center' />
</div>);
}
}

module.exports = ChangePassword;
