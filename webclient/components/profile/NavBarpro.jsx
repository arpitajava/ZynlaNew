import React, {Component} from 'react';
import {Button, Image, Grid, Statistic, Segment, Header, Loader, Popup,
  Input} from 'semantic-ui-react';
import Cookie from 'react-cookie';
import Chat from './basicInfo/chatbot.jsx';
let DisplayQues = require('./questions/displayQuestions.jsx');
let DisplayAns = require('./answers/displayAnswers.jsx');
let BasicInfo = require('./basicInfo/basicInfo.jsx');
let DisplayFollowing = require('./following/displayFollowing');
let DisplayFollower = require('./followers/displayFollower');
import WatchingCard from './basicInfo/watchingCategories/watchingCard.jsx';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

let picStyle = {
    marginTop: '3%'
};
let meterStyle = {
    marginTop: '30%',
    marginLeft: '57.5%',
    color: '#B2242E'
};
let imageStyle = {
  marginLeft: '35%'
};
let nameStyle = {
    marginTop: '1%',
    fontSize: '20px',
    fontWeight: 'bold',
    marginLeft: '37.5%',
    color: '#B2242E',
    cursor: 'pointer'
};
let buttonStyle = {
  marginLeft: '20%',
  marginTop: '5%'
};
class NavBarPro extends Component {

  constructor() {
    super();
    this.state = {
        name: 'name',
        questionCount: 0,
        answerCount: 0,
        followerCount: 0,
        followingCount: 0,
        foname: 0,
        primary: '',
        secondary: '',
        university: '',
        objArray: [],
        status: 0,
        watchingData: [],
        content: '',
        watchingCount: 0,
        load: false,
        picture: ''
    };
    this.getProfile = this.getProfile.bind(this);
  }
// Fetch Basic Info page
    viewInfo() {
      this.setState({
        content: <BasicInfo statusMeter = {this.getProfile}/>
      });
    }
    // Fetch Questions page
    getQuestions() {
      if(this.state.questionCount === 0)
      {
        this.noQuestionsAlert();
      }
      else{
      this.setState({
        content: <DisplayQues/>
      });
    }
    }
    // Fetch Answers page
    getAnswers() {
      if(this.state.answerCount === 0)
      {
        this.noAnswersAlert();
      }
      else{
      this.setState({
        content: <DisplayAns/>
      });
    }
    }
    // Fetch Followers page
    getFollowers() {
      this.setState({
        content: <DisplayFollower/>
      });
    }
    // Fetch Following page
    getFollowings() {
      this.setState({
        content: <DisplayFollowing/>
      });
    }
    noAnswersAlert () {
       this.refs.container.error(
         'No Answers yet!!',
         '', {
         timeOut: 2000,
         extendedTimeOut: 10000
       });
     }
    noQuestionsAlert () {
       this.refs.container.error(
         'No Questions yet!!',
         '', {
         timeOut: 2000,
         extendedTimeOut: 10000
       });
     }
    noWatchingsAlert () {
       this.refs.container.error(
         'Not Watching any Topics',
         '', {
         timeOut: 2000,
         extendedTimeOut: 10000
       });
     }
     changePicture(e) {
         this.setState({picture: e.target.value});
         if(e.key === 'Enter') {
           this.updateAbout();
         }
     }
    componentDidMount() {
        this.getProfile();
    }
    // Fetch All Info from databasex
    getProfile() {
      this.setState({
        status: 0,
        content: <BasicInfo statusMeter = {this.getProfile}/>,
        load: true
      });
      /*eslint-disable*/
      let context = this;
      /*eslint-enable*/
      let email = Cookie.load('email');
        $.ajax({
            url: '/userdoc/getuserprofile',
            type: 'POST',
            data: {email: email},
            success: function(data) {
                context.setState({questionCount: data.lists.length,
                   answerCount: data.answers.length,
                     followingCount: data.followingUser.length,
                     name: data.profile.name,
                     objArray: data, load: false, picture: data.profile.picture});
                     if(data.profile.gender.length > 0 && data.profile.gender !== 'gender' &&
                     data.profile.gender !== ' ') {
                       context.setState({
                         // setting conditions for profile meter
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.name.length > 0 &&
                       data.profile.name !== 'name' &&
                       data.profile.name !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.education.highSchool.length > 0 &&
                       data.profile.education.highSchool !== 'Secondary' &&
                       data.profile.education.highSchool !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.education.university.length > 0 &&
                       data.profile.education.university !== 'University' &&
                         data.profile.education.university !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.address.country.length > 0
                       && data.profile.address.country !== 'Country'
                     && data.profile.address.country !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.address.city.length > 0
                       && data.profile.address.city !== 'City'
                     && data.profile.address.city !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.address.region.length > 0
                       && data.profile.address.region !== 'State'
                     && data.profile.address.region !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.dob.length > 0 && data.profile.dob !== 'dob'
                   && data.profile.dob !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.phone.length > 0 && data.profile.phone !== 'Phone'
                   && data.profile.phone !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
                     if(data.profile.description.length > 0
                       && data.profile.description !== 'Describe About Yourself'
                     && data.profile.description !== ' ') {
                       context.setState({
                         status: parseInt(context.state.status, 10) + 10
                       });
                     }
            },
            error: function() {
              // console.log('error in logout' + err);
            }
        });
        $.ajax({
            url: '/userdoc/getWatching',
            type: 'POST',
            data: {
                email: Cookie.load('email')
            },
            success: function(data) {
                // console.log(data);
                context.setState({
                  watchingData: data,
                  watchingCount: data.length
                  // setting interestData to content
                });
            },
            error: function() {
                // console.error(err.toString());
            }
        });
        $.ajax({
            url: '/userdoc/getFollowers',
            type: 'POST',
            data: {email: Cookie.load('email'), skip: 0, limit: 100},
            success: function(data) {
              context.setState({
              followerCount: data.length
            });
            },
            error: function() {
             // console.log('error in logout' + err);
            }
        });
    }
   // Fetch Interested Topics from data base
   getWatching() {
     if(this.state.watchingData.length === 0)
     {
       this.noWatchingsAlert();
     }
     else{
     this.setState({
       content: <WatchingCard watchingData={this.state.watchingData}/>
     });
   }
 }
 updateAbout() {
     //   // console.log(JSON.stringify(proData);
     /*eslint-disable*/
     console.log('here in picture');
     let context = this;
     /*eslint-enable*/
     $.ajax({
         url: '/userdoc/updatePicture',
         type: 'POST',
         data: {picture: this.state.picture, email: Cookie.load('email')},
         success: function() {
           context.getProfile();
         },
         error: function() {
             // console.error(err.toString());
         }
     });
 }
    render() {
        const followerCount = this.state.followerCount;
        const followingCount = this.state.followingCount;
        let profMeter = parseInt(this.state.status, 10) + '%';
        return (
            <div>
              <Segment style={{marginRight: '6.70%'}}>
                <Grid centered columns={2}>
                    <Grid.Column style={picStyle}>
                      <Popup on = 'click' trigger={<Image alt= 'No Image' style={imageStyle}
                        src={Cookie.load('profilepicture')}
                          size = 'small' shape='circular'/>}
                      flowing hoverable>
                      <Input onChange={this.changePicture.bind(this)} onKeyPress =
                      {this.changePicture.bind(this)}/>
                      <Button onClick = {this.updateAbout.bind(this)} content='Update'/>
                    </Popup>
                        <div style={nameStyle} onClick={this.viewInfo.bind(this)}>
                            {this.state.name}
                        </div>
                        <div style = {buttonStyle}>
                           <Button onClick={this.getFollowers.bind(this)}
                             className='butstyle'
                             content='Followers'
                             icon='user plus' label={{
                               basic: true,
                               pointing: 'left',
                               content: followerCount
                           }}/>
                           <Button onClick={this.getFollowings.bind(this)} className='butstyle'
                             content='Following'
                             icon='fork' label={{
                               basic: true,
                               pointing: 'left',
                               content: followingCount
                           }}/>
                         </div>
                    </Grid.Column>
                    <Grid.Column>
                      <div style={meterStyle}>
                        <Statistic>
                          <Statistic.Label>Profile Meter</Statistic.Label>
                          <Statistic.Value> {profMeter}
                          </Statistic.Value>
                          <Statistic.Label>completed</Statistic.Label>
                          <Chat handle = {this.getProfile.bind(this)}/>
                        </Statistic>
                        <Loader size='huge' style={{marginLeft: '180px', marginTop: '60px'}}
                          active ={this.state.load}/>
                        </div>
                    </Grid.Column>
                  </Grid>
                     </Segment>
                <div>
                    <br/>
                  <Grid>
                    <Grid.Column width = {11}>
                    {this.state.content}
                  </Grid.Column>
                  <Grid.Column width = {4}>
                    <Segment>
                      <Header style ={{cursor: 'pointer'}} dividing
                        onClick={this.getQuestions.bind(this)}>
 <Header.Content>
   Questions &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {this.state.questionCount}
 </Header.Content>

</Header>

<Header style ={{cursor: 'pointer'}} dividing onClick={this.getAnswers.bind(this)}>
  <Header.Content>
    Answers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {this.state.answerCount}
  </Header.Content>

</Header>
<Header style ={{cursor: 'pointer'}} dividing onClick={this.getWatching.bind(this)}>
  <Header.Content>
    Watching Topics &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;{this.state.watchingCount}
  </Header.Content>

</Header>
</Segment>
                  </Grid.Column>
                  <Grid.Column width = {1}/>
                </Grid>
              </div>
              <ToastContainer ref='container' style ={{backgroundColor: '#B2242E'}}
                     toastMessageFactory={ToastMessageFactory}
                     className='toast-top-center' />
            </div>
        );
    }
}

module.exports = NavBarPro;
