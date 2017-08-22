import React from 'react';
import {hashHistory} from 'react-router';
import {Button, Modal, Dimmer, Header, Loader} from 'semantic-ui-react';
import {Form} from 'semantic-ui-react';
import validator from 'validator';
import Axios from 'axios';
export default class Signup extends React.Component {
    constructor()
    {
        super();
        this.state = {
            opendimmer: false,
            emailId: '',
            userexists: '',
            firstname: '',
            lastname: '',
            email: '',
            message: '',
            errorfirst: false,
            errorlast: false,
            erroremail: false,
            errorrepassword: false,
            errorpassword: false,
            errormessageemail: '',
            errormessagefirst: '',
            errormessagelast: '',
            errormessage: '',
            errormessagepassword: '',
            repassword: '',
            password: '',
            mailexists: false,
            decoration: false,
            confirmpassword: false,
            verifypassword: false,
            open: true
        };
        this.onRegisterUser = this.onRegisterUser.bind(this);
    }
    handleOpen = () => this.setState({ active: true })
    handleClose = () => this.setState({ active: false })

    close = () => hashHistory.push('/');

    // new user signup
    onRegisterUser(e, value) {
      e.preventDefault();
      if(value.formData.password === value.formData.repassword)
        {
          this.setState({opendimmer: true});
          $.ajax({
            url: '/users/signup',
            method: 'post',
            data: value.formData,
            success: function(dataEmail) {
                $.ajax({
                url: ' /users/send',
                method: 'post',
                data: {
                    data: dataEmail.email
                  },
                  success: function(data) {
                    // console.log(data.email);
                        hashHistory.push('/mail?emailId=' + data.email);
                    },
                    error: function() {
                        // console.log('Errorrrrrrrr');
                          // console.log(err);
                            // this.setState({openSnackbar: true, snackbarMsg: err.responseText});
                    }
                });
            },
                error: function() {
                  // console.log(err);
                    // this.setState({openSnackbar: true, snackbarMsg: err.responseText});
                }
          });
        }
  }

    // validation for firstname
    changeFirst = (event) => {
        this.setState({firstname: event.target.value});
        if (validator.isAlpha(event.target.value)) {
            this.setState({errorfirst: false});
            this.setState({errormessagefirst: false});
        } else {
            this.setState({errorfirst: true});
            this.setState({errormessagefirst: 'Enter a valid name'});
        }
    }
    // validation for lastname
    changeLast = (event) => {
        this.setState({lastname: event.target.value});
        if(this.state.lastname.length > 0) {
            if (validator.isAlpha(event.target.value)) {
                this.setState({errorlast: false});
                this.setState({errormessagelast: false});
            } else {
                this.setState({errorlast: true});
                this.setState({errormessagelast: 'Enter a valid name'});
            }
        }
    }
    // validation for email
    changeEmail = (event) => {
        this.setState({email: event.target.value});
        // console.log(event.target.value);
        // check whether the user is alreay exists or not
        if(event.target.value.length >= 0) {
        if (validator.isEmail(event.target.value)) {
           /*eslint-disable*/
          let self = this;
          /*eslint-enable*/
            Axios({
                url: ' /users/checkuser',
                method: 'POST',
                data: {
                    email: event.target.value
                }
              }).then(function(response) {
                    if (response.data.userexists &&
                        response.data.authType === 'google' ||
                        response.data.authType === 'facebook') {
                      self.setState({userexists: 'Already Exists via ' + response.data.authType});
                      self.setState({mailexists: false});
                        // console.log(msg);
                    }
                     else if (response.data.userexists && response.data.authType === 'local') {
                      self.setState({userexists: 'Already Exists'});
                      self.setState({mailexists: false});
                        // console.log(msg);
                    }
                    else {
                        // console.log(msg);
                        self.setState({userexists: ' '});
                        self.setState({mailexists: true});
                    }
                }).catch(function() {
                    // console.log(err);
                });
            this.setState({erroremail: false});
            this.setState({errormessageemail: false});
        } else {
            this.setState({erroremail: true});
            this.setState({errormessageemail: 'Enter valid email, including \@\ '});
        }
      }
    }
    // validation for password
    changePassword = (event) => {
        this.setState({password: event.target.value});
        // console.log(event.target.value)
        let points = event.target.value.length;
        let passwordInfo = event.target.value;
        let hasLetter = new RegExp('[a-z]');
        let hasCaps = new RegExp('[A-Z]');
        let hasNumbers = new RegExp('[0-9]');
        if (hasLetter.test(passwordInfo) && points >= 6 &&
            hasCaps.test(passwordInfo) && hasNumbers.test(passwordInfo)) {
            this.setState({errorpassword: false});
            this.setState({errormessagepassword: false});
              this.setState({verifypassword: true});
        } else {
            this.setState({errorpassword: true});
            this.setState({verifypassword: false});
            this.setState({errormessagepassword:
            'Password should contain numbers, letters(A&a) and minimum length 6'});
        }
    }
    // validation for confirmpassword
    changeRepassword = (event) => {
        this.setState({repassword: event.target.value});
          if(event.target.value.length > 2) {
            if (validator.equals(event.target.value, this.state.password)) {
          // checking equality between password and confirmpassword
          this.setState({errorrepassword: false});
          this.setState({errormessage: false});
            this.setState({confirmpassword: true});
          }
      else {
        this.setState({confirmpassword: false});
        this.setState({errorrepassword: true});
        this.setState({errormessage: 'Password mismatch'});
    }
  }
}
render() {
    const {open, active} = this.state;
    return (
        <div>
        <Modal open={open} onClose={this.close}
        size="small" closeIcon="close">
        <Modal.Header style={{backgroundColor: 'teal'}}>
        <p style={{color: 'white', marginLeft: 300 + 'px'}}>Sign Up</p>
        </Modal.Header>
        <Modal.Content>
        <Form onSubmit={this.onRegisterUser}>
        <Form.Field>
        <Form.Input label='First Name' name='firstName' placeholder=
        'First Name' type='text' onChange={this.changeFirst}
        error={this.state.errormessagefirst} required/>
        <p style={{color: 'red', float: 'right'}}>{this.state.errormessagefirst}</p>
        </Form.Field>
        <Form.Field>
        <Form.Input label='Last Name' id="input" name="lastName"
        placeholder='Last Name' type='text' onChange=
        {this.changeLast.bind(this)} error={this.state.errorlast}/>
        <p style={{color: 'red', float: 'right'}}>{this.state.errormessagelast}</p>
        </Form.Field>
        <Form.Field>
        <Form.Input label='Email' id="to" name="email"
        placeholder='Email-ID' type='text'
        onChange={this.changeEmail.bind(this)}
        error={this.state.erroremail} required/>
        <p style={{color: 'red', float: 'right'}}>{this.state.errormessageemail}</p>
        <p style={{color: 'red', float: 'right'}}>{this.state.userexists}</p>
        </Form.Field>
        <Form.Field>
        <Form.Input label='Password' id="input" name="password"
        placeholder='Password' type='password' onChange={this.changePassword.bind(this)}
        error={this.state.errorpassword} required/>
        <p style={{color: 'red', float: 'right'}}>{this.state.errormessagepassword}</p>
        </Form.Field>
        <Form.Field>
        <Form.Input label='Confirm Password' id="input" name="repassword"
        type='password' placeholder='Confirm Password'
        onChange={this.changeRepassword.bind(this)} error={this.state.errorrepassword} required/>
        <p style={{color: 'red', float: 'right'}}>{this.state.errormessage}</p>
        </Form.Field>
        <Button primary type = 'submit' style={{marginLeft: 221 + 'px'}} onClick={this.handleOpen}
        circular disabled={!this.state.firstname || !this.state.email ||
        !this.state.password || !this.state.repassword || !this.state.mailexists
        || !this.state.verifypassword || !this.state.confirmpassword} > CREATE YOUR ACCOUNT
        </Button>
        {this.state.opendimmer ? < Dimmer
                 active = {active}
                 onClickOutside = {this.handleClose}
                 page>

                <Header as='h2' icon inverted>
                <Loader active inline />
                   <Header.Subheader><h3>Verification mail Sending......
                   </h3></Header.Subheader>
                 </Header>
        </Dimmer > : null}
        <h4 id="text" style={{marginLeft: 221 + 'px'}}>Already a member?&nbsp;<a href='#/'>
        Sign in here</a>
        </h4>
        </Form>
        </Modal.Content>
        </Modal>
        </div>
        );
}
}
