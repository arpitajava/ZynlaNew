let React = require('react');
let {hashHistory} = require('react-router');
import {Button, Grid, Icon, Form, Segment } from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
import validator from 'validator';
// import graph from 'fbgraph';
import $ from 'jquery';
// const ReactToastr = require('react-toastr');
// const {ToastContainer} = ReactToastr;
// const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

class VerifyEmail extends React.Component {
   constructor() {
       super();
       this.state =
       {
        open: true
        };
      this.verifyAccount = this.verifyAccount.bind(this);
      this.locAlertError = this.locAlertError.bind(this);
   }
      locAlertError () {
        this.refs.container.error(
          'Please Enter a valid ID',
          '', {
          timeOut: 1000,
          extendedTimeOut: 10000
        });
      }
    verifyAccount(e, value) {
        e.preventDefault();
        // let emailID = window.location.hash.split('emailId=')[1];
        /* eslint-disable*/
        let context = this;
        /* eslint-enable*/
        if(validator.isAlpha(value.formData.verId, 'en-US'))
        {
          context.locAlertError();
        }
        else if(validator.isEmpty(value.formData.verId))
        {
          context.locAlertError();
        }
        else
        {
          $.ajax({
                url: '/users/verify',
                type: 'POST',
                data: {
                    verifyId: value.formData.verId,
                    email: window.location.hash.split('emailId=')[1]
                },
                success: function(data) {
                  // console.log(data);
                    if(data.isVerified)
                    {
                    hashHistory.push('/selectCategory');
                    }
                    else
                    {
                      context.locAlertError();
                    }
                },
                error: function() {
                  // console.log(err);
                    // this.setState({openSnackbar: true, snackbarMsg: err.responseText});
                }
            });
          }
        }

render() {
  return (
    <div className="overlay">
      <img src="./../../image/Zynla.png"
       className="imagePosition" style = {{marginLeft: 600 + 'px'}}/>
      <p className="tagline"
       style={{marginLeft: 541 + 'px', color: 'white'}}>
       Verification code has been sent to your Email Id.</p>
  <div className="centerPosition">
<Segment compact style = {{marginLeft: -24 + 'px'}} inverted>
  <Grid centered >
       <Form onSubmit={this.verifyAccount} className="contentCenter">
            <Form.Field>
            <Form.Input name= "verId" placeholder= 'Enter Verification Code' icon='lock'
            iconPosition='left' id="formstyle"
             required />
            </Form.Field>

            <Button color='teal' circular>
            <Button.Content type='submit' ><Icon name='sign in'/>
            Verify Your Account</Button.Content>
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

module.exports = VerifyEmail;
