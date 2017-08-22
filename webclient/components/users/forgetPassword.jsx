import React from 'react';
// import Axios from 'axios';
import validator from 'validator';
// import Snackbar from 'material-ui/Snackbar';
import {
    Button,
    Modal,
    Icon,
    Image,
    Form
} from 'semantic-ui-react';
import {hashHistory} from 'react-router';
// import validator from 'validator';
import $ from 'jquery';
export default class LoginPage extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            openSnackbar: false,
            snackbarMsg: '',
            erroremail: false,
            errormessageemail: '',
            email: '',
            validemail: '',
            emailExistMessage: '',
            forgetPasswordMessage: ''
        };
        this.forgetPasswordEmail = this.forgetPasswordEmail.bind(this);
    }
      /*eslint-disable*/
        changeUserEmail(emailID)
        {
          let bool = false;
          console.log(emailID);
          let self = this;
        this.setState({email: emailID});
        if (validator.isEmail(emailID)) {
            $.ajax({
                url: ' /users/checkuser',
                method: 'POST',
                async: false,
                data: {
                    email: emailID
                },
            success: function(response) {
                    if (response.authType === 'google' ||
                        response.authType === 'facebook') {
                        console.log('inside then function');
                        bool = false;
                        // console.log(self.setState({bool: false}));
                    }
                    else if(response.userexists === false)
                    {
                      bool = false;
                    }
                     else{
                      console.log('in else true');
                      bool = true;
                      // self.setState({bool: true});
                    }
                },
                error: function() {
                    // console.log(err);
                }
            });
            // console.log('check ' + this.state.bool);
            return bool;
         }
    }
    /*eslint-enable*/
    forgetPasswordEmail(e, value)
    {
      /* eslint-disable*/
        let context = this;
        /* eslint-disable*/
        e.preventDefault();
        if(value.formData.userName.length === 0)
        {
          context.setState({forgetPasswordMessage: 'Please enter an Email Id'});
        }
        else {
          // console.log(this.changeUserEmail(value.formData.userName));
    if(this.changeUserEmail(value.formData.userName))
    {
    $.ajax({
      url: '/users/forgetPassword',
      type: 'POST',
      data: {
          email: value.formData.userName
      },
      success: function()
      {
        context.setState({forgetPasswordMessage: 'Password has been sent to your mail Id'});
      },
      error: function()
      {
        context.setState({forgetPasswordMessage: 'Some error occured'});
      }

    });
    }
    else
    {
      context.setState({forgetPasswordMessage: 'Email exists through Google or Facebook provider. Please update with the provider.'});
    }
  }

}
        handleRequestClose = () => {
            this.setState({openSnackbar: false});
        };
    show = (dimmer) => () => this.setState({dimmer, open: true})
    close = () => hashHistory.push('/');
    render() {
        const {open} = this.state;
        return (
            <Modal open={open} onClose={this.close} closeIcon="close">
                    <Modal.Header>Lets Find your Zynla Account</Modal.Header>
                    <Modal.Content image>
                      <Image wrapped size='medium'
                      src='https://cdn0.iconfinder.com/data/icons/PRACTIKA/256/user.png'
                      style={{width: 80 + 'px', height: 80 + 'px', marginLeft: 39 + 'px',
                      marginTop: -5 + 'px'}}/>
                        <Form onSubmit={this.forgetPasswordEmail}>
                            <Form.Field>
                              <Form.Input name= "userName" placeholder = 'Enter Email Id'
                              style=
                              {{width: 560 + 'px', height: 50+'px',marginTop: 9 + 'px'}}/>
                              <p style={{color: 'green'}}>{this.state.forgetPasswordMessage}</p>
                              <Button color='teal' circular style=
                              {{marginLeft: 27 + 'px',
                                float: 'right',
                                marginRight: - 160 + 'px',
                                marginTop: - 59 + 'px'}}>
                                <Button.Content type='submit'>
                                  <Icon name='mail outline'/>Send Email</Button.Content>
                              </Button>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                  </Modal>
            );
}
}
