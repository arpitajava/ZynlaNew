import React from 'react';
import ConceptStructure from './conceptStructure.jsx';
import {Grid, Icon, Popup, Button} from 'semantic-ui-react';
import Cookie from 'react-cookie';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class Concepts extends React.Component {
    constructor() {
        super();
        this.state = {
            start: 0,
            end: 3,
            result: ''
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
        let start = 0;
        if (this.state.start - 4 < 0) {
            start = 0;
        } else {
            start = this.state.start - 4;
        }
        let end = this.state.end - 4;
        this.setState({start: start, end: end});
    }
    getusers()
    {
        $.ajax({
            url: '/users/getAllUserName',
            type: 'get',
            success: function(data) {
                // console.log(JSON.stringify(data));
                this.setState({userNames: data});
            }.bind(this),
            error: function() {}
        });
    }
    sendInvite(mail, lStat)
    {
        let sender = Cookie.load('username');
        let uMail = mail;
        let ulStat = lStat;
        /* eslint-disable */
        let context = this;
        let topic = this.props.topic;
        $.ajax({
            url: '/followinvite/sendInviteTopicEmail',
            type: 'post',
            data: {
                Topic: topic,
                type: 'topic',
                emailId: uMail,
                sender: sender,
                lStatus: ulStat
            },
            success: function(data) {
                // this.setState({iconName: 'add', text: 'saved'});
                context.setState({result: data});
                 context.inviteAlert(context.state.result);
                // // this.setState({inviteName: 'Invited', inviteColor: 'red'});
                // console.log("mail sent");
            }.bind(this),
            /* eslint-enable */
            error: function() {}
        });
    }

    /* fetching the textbox value Createdon 10/3/2017 by Soundar*/
    changeval(e)
    {
        this.setState({s: e.target.value});
        this.findAllUsers(this.state.s);
    }
    /* fetching all usernames and emailid from mongo DB Createdon 10/3/2017 by Soundar*/
    findAllUsers(s)
    {
        let userNames = this.state.userNames;
        //  let loginUser = Cookie.load('username');
        let loginEmail = Cookie.load('email');
        //  // console.log(loginUser);
        if(s.length > 1)
        {
        let b = s.toLowerCase();
        // console.log(b);
        let option = '';
        for (let i = 0; i < userNames.length; i = i + 1) {
            // console.log(userNames[i].name);
            if (userNames[i].name.toLowerCase().indexOf(b) === 0 &&
            userNames[i].email !== loginEmail) {
                option = option + '<option value= "' + userNames[i].name + '"/>';
            }
        }
        document.getElementById('usernames').innerHTML = option;
        // React.render(<ReactDatalist list="countries" options={option} />, document.body)
        option = '';
        this.setState({s: ''});
      }
    }
    /* fetch the mailId of the particular user selected in textbox Createdon 10/3/2017 by Soundar**/
    findMail()
    {
        let mail = '';
        let lStat = '';
        let loginEmail = Cookie.load('email');
        let uname = document.getElementById('users');
        // let uname = '';
        if(uname.value === '')
        {
          this.inviteAlert(uname.value);
        }
        else {
          let userNames = this.state.userNames;
          // console.log(userNames.length);
          for (let i = 0; i < userNames.length; i = i + 1) {
              if (userNames[i].name === uname.value && userNames[i].email !== loginEmail) {
                  mail = userNames[i].email;
                  lStat = userNames[i].lStatus;
                  break;
              }
          }
          // console.log(mail);
          this.sendInvite(mail, lStat);
        }
          }
    openPopup() {
  this.setState({ isOpen: true });
  this.getusers();
}
closePopup() {
  this.setState({ isOpen: false });
}
  inviteAlert (result) {
    if(result !== '')
    {
     this.refs.container.success(
        '"' + result + '"',
       '', {
       timeOut: 2000,
       extendedTimeOut: 10000
     });
     this.closePopup();
   }
   else {
     this.refs.container.error(
        'select username to invite',
       '', {
       timeOut: 2000,
       extendedTimeOut: 10000
     });
     this.closePopup();
   }
   }

    render() {
        let conceptName = [];
        for (let i = this.state.start; i <= this.state.end; i = i + 1) {
            if (typeof this.props.json[i] !== 'undefined') {
                conceptName.push(this.props.json[i]);
            }
        }
        // map function to send concepts of a topic to child (conceptStructure)
        let Data = conceptName.map(function(item) {
            return (
                <Grid.Column>
                    <ConceptStructure conceptName={item.name}/>
                </Grid.Column>
            );
        });
        /* eslint-disable */
        const content = (
          <Popup wide open={this.state.isOpen} onClose={() => this.closePopup()}
      trigger={<Button circular onClick={() => this.openPopup()}
      icon='mail outline' id='iconColor'
      size='huge' />} on='click' position='bottom right'>
        <Icon name='remove' onClick={() => this.closePopup()}
         style={{marginTop: 3 + 'px', marginBottom: 10 + 'px', marginLeft: 10 + 'px', float:'right'}}/>
      <p style={{'text-align': 'center','padding-right': '10px','margin-top': '0px'}}>
      <div class="ui fluid icon input">
        <input style={{'resize': 'horizontal','width': '250px','height':'30px'}} id="users" placeholder="Search friends Here" list="usernames" onKeyDown={this.changeval.bind(this)} />
 <datalist id="usernames"></datalist></div><br />
<Button fluid animated='fade' onClick={this.findMail.bind(this)} color='red' className='butstyle'>
<Button.Content visible >
  <p style={{'text-align': 'center','color': 'white','font-family': 'Arial, Helvetica, sans-serif'}}>  Invite</p>
</Button.Content>
<Button.Content hidden >
<p style={{'text-align': 'center','color': 'white','font-family': 'Arial, Helvetica, sans-serif'}}>  Invite a friend</p>
</Button.Content>
</Button>
</p>
</Popup>
        );
        /* eslint-enable */
        return (
          <div className = 'favbg'>
            <Grid centered style={{marginLeft: -250 + 'px'}}>
            <h1 className = 'conceptheading' style={{fontSize: 50 + 'px'}}>{this.props.topic}</h1>
            </Grid>
            <Grid centered style = {{marginTop: -30 + 'px'}}>
                <Grid.Column width={2} style={{marginTop: 56 + 'px',
                 marginRight: -35 + 'px' }} className='arrowsize'>
                    <Icon name='chevron left' onClick={this.changeStartLeft.bind(this)}/>
                </Grid.Column>
                <Grid.Column width={6} centered style={{marginLeft: -70 + 'px',
                 marginTop: 40 + 'px', marginBottom: -70 + 'px', marginRight: -50 + 'px'}} >
                    <Grid centered columns={4}>
                        {Data}
                    </Grid>
                </Grid.Column>
                <Grid.Column widt
                  /* eslint-enable */h={2} style={{marginTop: 56 + 'px',
                 marginLeft: 70 + 'px'}} className='arrowsize'>
                    <Icon name='chevron right' onClick={this.changeStartRight.bind(this)}/>
                </Grid.Column>
             <Grid.Column width={3} className='arrowsize' style={{paddingTop: 80 + 'px'}}>
               <div>
                 {content}
              <Icon name = {this.props.Icon} color={'red'} size = "huge"
               onClick = {this.props.followTopic.bind(this)}/>
                        {this.props.ques}
               </div>

                </Grid.Column>
            </Grid>
            <ToastContainer ref='container' style ={{backgroundColor: '#B2242E '}}
                                toastMessageFactory={ToastMessageFactory}
                                className='toast-top-center' />

          </div>
        );
    }
  }
  // type that props will accept coming from the parent
  Concepts.propTypes = {
   json: React.PropTypes.func,
   topic: React.PropTypes.string,
   ques: React.PropTypes.string,
   followTopic: React.PropTypes.func,
   Icon: React.PropTypes.string
 };
  module.exports = Concepts;
