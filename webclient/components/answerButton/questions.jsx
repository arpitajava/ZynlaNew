// written by Arun Mohan Raj
// importing the required files
import React from 'react';
import {
   Grid,
   Divider,
   Icon,
   Dimmer,
   Loader
} from 'semantic-ui-react';
let {hashHistory} = require('react-router');
import Cookie from 'react-cookie';
import QueCards from './cardsCollection.jsx';
// suggested questions display page
class Questions extends React.Component {
   constructor() {
       super();
       this.state = {
           active: false,
           objArray: [],
           check: false,
           likeArray: [],
           dislikeArray: [],
           queIdsArr: []
       };
       this.getQuestions = this.getQuestions.bind(this);
       this.handleOpen = this.handleOpen.bind(this);
       this.handleClose = this.handleClose.bind(this);
   }
   // functions to start and stop loader
   handleOpen() {this.setState({ active: true });}
   handleClose() {this.setState({ active: false });}
   // function to get questions from database
   getQuestions() {
     let emailId = Cookie.load('email');
     let arr1 = [];
     this.handleOpen();
       $.ajax({
         url: `/users/getAllCards/${emailId}`,
         type: 'GET',
           success: function(data) {
             let queObj;
             let checkQueArr = this.state.queIdsArr;
               let arr = [];
             data.map(function(item) {
              //  console.log(item.tag);
              // console.log('checking',checkQueArr);
              // console.log(item.id);
              if((checkQueArr.includes(item.id))) {
                // console.log('already answered', item.id);
              }else {
                /* eslint-disable */
               if(item.tag !== 'Following'
                && item.tag !== 'Posted by you' && item.tag !== 'You Preferred') {
                 arr1.push(item);
               }
             }
             /* eslint-enable */
             });
               queObj = arr1;
               for (let i = 0; i < queObj.length; i = i + 1) {
                 if(queObj[i].id) {
                 arr.push(queObj[i].id);
                 }
               }
               let email = Cookie.load('email');
                 $.ajax({
                     url: '/list/getLikeStatus',
                     type: 'POST',
                     data: {
                         mail: email,
                         qids: JSON.stringify(arr)
                     },
                     success: function(data2) {
                        //  console.log('front end', data2);
                         this.setState({likeArray: data2.like,
                           dislikeArray: data2.unlike, check: true, objArray: arr1});
                     }.bind(this),
                     error: function() {
                      //  console.log('failure in UI side',err);
                     }
                 });
               this.handleClose();
           }.bind(this),
           error: function() {
           }
       });
   }
   getAnswerIds() {
    //  console.log('inside 1');
     /*eslint-disable*/
     let context = this;
     let queIds = [];
     /*eslint-enable*/
           $.ajax({
           url: '/userdoc/getuserAnsId',
           type: 'post',
           data: {
               email: Cookie.load('email')
           },
           success: function(data) {
            //  console.log(data);
             context.setState({queIdsArr: data});
           },
           error: function() {

           }
       });
   }
   // getQuestions function is called as soon as the page renders
   componentDidMount() {
     this.getAnswerIds();
       this.getQuestions();
   }
// display question component
render() {
  let queCards;
    const { active } = this.state;
    if(Cookie.load('email') && (this.state.check)) {
      queCards = (<div><Dimmer active={active} page>
       <Loader>Fetching Questions</Loader>
     </Dimmer>
       <Grid divided='vertically'>
           <Grid.Row columns={3}>
               <Grid.Column width={2}/>
               <Grid.Column width={10}>
                   <h1>
                       <Icon name='star' color='red'/>Questions For You
                   </h1>
                   {
                     /*
                     <div>
                       <Breadcrumb>
                           <Breadcrumb.Section link>Home</Breadcrumb.Section>
                           <Breadcrumb.Divider icon='right angle'/>
                           <Breadcrumb.Section link>Suggested Questions</Breadcrumb.Section>
                       </Breadcrumb>
                   </div>
                   */
                 }
                   <Divider clearing/>
                   <div>
                       <QueCards quesCollection={this.state.objArray}
                       queLike={this.state.likeArray} queDislike={this.state.dislikeArray}/>
                   </div>
                   </Grid.Column>
               <Grid.Column width={2}/>
           </Grid.Row>
       </Grid></div>);
    } else if(Cookie.load('email')) {
      // else to prevent the redirection to homepage
    } else {
      hashHistory.push('/');
    }
    return (
      <div><Dimmer active={active} async={false} page>
       <Loader>Fetching Questions</Loader>
     </Dimmer>
       {queCards}
      </div>
    );
}
}
module.exports = Questions;
