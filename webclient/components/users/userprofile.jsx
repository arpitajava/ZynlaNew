import React from 'react';
import {hashHistory} from 'react-router';
import {Button, Modal, Dimmer} from 'semantic-ui-react';
import {Form} from 'semantic-ui-react';
import Cookie from 'react-cookie';
import CountrySelect from 'react-country-select';
export default class UserProfileData extends React.Component {
    constructor()
    {
        super();
        this.state = {
          active: '',
          opendimmer: false,
          open: true,
          errordate: false,
          errordatemessage: '',
          errordatecheck: false,
          country: ''
        };
        this.updateUserProfile = this.updateUserProfile.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }
    handleOpen = () => this.setState({ active: true })
    handleClose = () => this.setState({ active: false })

    close = () => hashHistory.push('/selectedCategory');

    onSelect(val) {
      // console.log("values selected are:", val);
      this.setState({country: val.label});
      // you can handle options selected here.
    }

    errorDate(event)
    {
        if(event.target.value.length > 0)
        {
            // console.log(dates.compare(new Date(event.target.value) , new Date()));
            if(new Date(event.target.value).getTime() < new Date().getTime())
            {
                this.setState({errordatemessage: ''});
                this.setState({errordatecheck: true});
            }
            else {
                    this.setState({errordatemessage: 'DOB should less than current date'});
                    this.setState({errordate: true});
                    this.setState({errordatecheck: false});
                }
        }
        else
        {
            this.setState({errordatemessage: 'Please enter date of Birth'});
            this.setState({errordatecheck: false});
        }
    }


    // new user update prifile
    updateUserProfile(e, value) {
      e.preventDefault();
      let profileObject = JSON.stringify(value.formData);
      // console.log(profileObject);
      // console.log(typeof(Date.parse(value.formData.dateofbirth)));
      // console.log(Cookie.load('email'));
      $.ajax({
            url: '/users/updateProfile/' + Cookie.load('email'),
            type: 'put',
            data: {
                data1: profileObject,
                country: this.state.country
            },
            success: function() {
                hashHistory.push('/home');
                // console.log('Successfully got JSON Catagory' + JSON.stringify(data));
            },
            error: function() {
                // console.log('error occurred on AJAX');
                // console.log(err);
            }
        });
  }

render() {
    // console.log(Cookie.load('email'));
    const options = [
        { key: 'm', text: 'Male', value: 'male' },
        { key: 'f', text: 'Female', value: 'female' }
        ];
    const {open, active} = this.state;
    return (
        <div>
        <Modal open={open} onClose={this.close}
        size="small" closeIcon="close">
        <Modal.Header style={{backgroundColor: 'teal'}}>
        <p style={{color: 'white'}}>CREATE YOUR PROFILE</p>
        </Modal.Header>
        <Modal.Content>
        <Form onSubmit={this.updateUserProfile}>

        <Form.Field>
        <Form.Input label='Date Of Birth' name="dateofbirth"
        placeholder='Date Of Birth' type='date' error={this.state.errordate}
        onChange={this.errorDate.bind(this)}/>
        <p style={{color: 'red'}}>{this.state.errordatemessage}</p>
        </Form.Field>

        <Form.Field>
        <Form.Select label='Gender' options={options} name='gender' placeholder='Gender' />
        </Form.Field>

        <Form.Field>
        <label htmlFor="country">Country:</label>
            <CountrySelect multi={false} name='country' flagImagePath="../../image/flags/"
            onSelect={this.onSelect}/>
        </Form.Field>
        {this.state.opendimmer ? < Dimmer
                 active = {active}
                 page/>
         : null
     }
        <Button type='submit' onClick={this.handleOpen}
        circular disabled={!this.state.errordatecheck}
        style = {{float: 'right', marginTop: -4 + 'px'}}> SUBMIT</Button>
        </Form>
        <a href='/#/home'>
        <Button
        circular>Skip</Button>
        </a>
        </Modal.Content>
        </Modal>
        </div>
        );
}
}
