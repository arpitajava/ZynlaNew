import React from 'react';
import {
    Icon,
    Image,
    Card,
    Button,
    Segment,
    Popup
} from 'semantic-ui-react';
import {Link} from 'react-router';
import Cookie from 'react-cookie';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class questionCard extends React.Component {
    constructor() {
        super();
        this.state = {
            check1: true,
            check2: false,
            iconName: 'save',
            text: 'save',
            result: ''

        };
    }

    handleShow = () => this.setState({active: true})
    handleHide = () => this.setState({active: false})

    /* To save the card which you follow in mongo db & Neo4j*/
    saveToProfile() {
        let emailId = Cookie.load('email');
        $.ajax({
            url: '/users/saveToProfile',
            type: 'PUT',
            data: {
                emailId: emailId,
                id: this.props.id,
                displayImage: this.props.displayImage,
                heading: this.props.heading,
                statement: this.props.question,
                postedBy: this.props.postedBy,
                profileImage: this.props.profileImage,
                addedOn: this.props.addedOn,
                category: this.props.category,
                upVotes: this.props.upVotes,
                downVotes: this.props.downVotes,
                noofans: this.props.answerCounts
            },
            success: function() {
                this.setState({iconName: 'add', text: 'saved'});
            }.bind(this),
            error: function() {}
        });
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
      /* eslint-enable */
      $.ajax({
          url: '/followinvite/sendInviteEmail',
          type: 'post',
          data: {
              id: this.props.id,
              type: 'question',
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
          },
          error: function() {}
      });
  }
  closeModal() {
      this.setState({isModalOpen: false});
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


 /*eslint-disable*/
    render() {
        const {active} = this.state;
        const content = (
              <div><Button circular onClick={this.saveToProfile.bind(this)}
                  icon='plus' className='spacing' id='iconColor'
                  size='tiny' style={{fontSize: 13 + 'px'}}/>
                  <Popup wide open={this.state.isOpen} onClose={() => this.closePopup()}
              trigger={<Button circular onClick={() => this.openPopup()}
              icon='mail outline' id='iconColor'
              size='tiny' style={{'fonSize': 15 + 'px'}}/>} on='click' position='bottom right'>
                <Icon name='remove' onClick={() => this.closePopup()}
                 style={{marginTop: 3 + 'px', marginBottom: 10 + 'px', marginLeft: 10 + 'px', float:'right'}}/>
              <p style={{'text-align': 'center','padding-right': '10px','margin-top': '0px'}}>
              <div class="ui fluid icon input">
                <input style={{'resize': 'horizontal','width': '250px','height':'25px'}} id="users" placeholder="Search friends Here" list="usernames" onKeyDown={this.changeval.bind(this)} />
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
                  </div>
          );
          let addedOn = parseInt(this.props.addedOn, 10);
       addedOn = new Date(addedOn).toString().substring(0, 10);

        return (
            <div className='CardSegment'>
                <Card raised={true} className='item' onClick={this.handleChange}>
                        <div className="PaddingCards">
                            <Image src={this.props.displayImage} className="imgsize"
                             onMouseEnter={this.handleShow} dimmer={{active, content}}
                              onMouseLeave={this.handleHide}/>
                              </div>
                                <Link to= {'/answerPage?id=' + this.props.id}>
                            <div>
                            <Card.Header id='textheader' className='spacing'>
                                <b className= 'headingcard'>{this.props.heading}</b>
                            </Card.Header>
                            </div>
                            </Link>
                            <div className='spacing' id='PaddingCards1'>
                                <Image className="border" floated='left' size='mini'
                          src={this.props.profileImage} alt = 'image'
                                />
                                <Card.Meta>
                                    <a href='' className='LinkColor'>{this.props.postedBy}</a>
                                </Card.Meta>
                                <Card.Meta>
                                    {addedOn}
                                </Card.Meta>
                            </div>

                        <div className="PaddingCardsBottom">
                            <Segment.Group horizontal>
                              <Segment><Icon name='like outline' color='green'/>{this.props.upVotes}
                            </Segment>
                              <Segment><Icon name='eye' color='black' size='large'/>
                              <b>{this.props.views}
                              </b></Segment>
                              <Segment><Icon name='write square' size='large'/>
                              <b>{this.props.answerCounts}
                              </b></Segment>
                            </Segment.Group>
                      </div>
                </Card>
                <ToastContainer ref='container' style ={{backgroundColor: '#B2242E '}}
                                    toastMessageFactory={ToastMessageFactory}
                                    className='toast-top-center' />


            </div>
        );/*eslint-enable*/
    }
}
questionCard.propTypes = {
    displayImage: React.PropTypes.string,
    heading: React.PropTypes.string,
    question: React.PropTypes.string,
    postedBy: React.PropTypes.string,
    addedOn: React.PropTypes.string,
    category: React.PropTypes.string,
    upVotes: React.PropTypes.string,
    downVotes: React.PropTypes.string,
    answerCounts: React.PropTypes.number,
    profileImage: React.PropTypes.string,
    views: React.PropTypes.number,
    acceptedCounts: React.PropTypes.string,
    remove: React.PropTypes.func,
    id: React.PropTypes.number
};

module.exports = questionCard;
