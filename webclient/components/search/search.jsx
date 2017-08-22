import Categories from './categories.jsx';
import QuestionPage from './questionpage';
import Concepts from './concepts';
import People from './people';
import React from 'react';
import $ from 'jquery';
import Cookie from 'react-cookie';
import {
    Dimmer,
    Loader
} from 'semantic-ui-react';
class Search extends React.Component {
    constructor() {
        super();
// defining the states
        this.state = {
            savedata: [],
            concept: [],
            component: '',
            people: '',
            isfollow: [],
            profile: [],
            followtopic: 'Follow',
             active: false,
             icon: 'plus circle'
        };
    }
    componentDidMount() {
      this.getSearchCards();
      this.getPeople();
      this.getConcept();
      this.isFollowTopic();
    }
// this method will re render the component when the url is changed
    componentWillReceiveProps() {
      this.getSearchCards();
      this.getPeople();
      this.getConcept();
      this.isFollowTopic();
    }
     handleOpen() {this.setState({ active: true });}
    handleClose() {this.setState({ active: false });}
// function to change component basing in the seected option (people or questions) in search
    changeComponent(x) {
      if(x === 'people') {
        /* eslint-disable */
        let temp = (
          <People people = {this.state.people} isfollow = {this.state.isfollow} profile = {this.state.profile}/>
        );
        /* eslint-enable */
        this.setState({
          component: temp
        });
      }
      else if(x === 'questions') {
        /* eslint-disable */
        let temp = (
          <QuestionPage display ={this.state.savedata} />
        );
        /* eslint-enable */
        this.setState({
          component: temp
        });
      }
    }
    /* Get the search cards*/
    getSearchCards() {
       this.handleOpen();
      let q = window.location.hash.split('question=')[1];
      let arr = [];
      $.ajax({
          url: '/search/getquestions',
          type: 'POST',
          data: {
            q: q
          },
          success: function(data) {
            data.map(function(item) {
              arr.push(item);
            });
            this.setState({savedata: arr});
            /* eslint-disable */
            let temp = (
              <QuestionPage display ={this.state.savedata} />
            );
            /* eslint-enable */
            this.setState({
              component: temp
            });
            this.handleClose();
          }.bind(this)
        });
   }
// get all people fallowing the particular topic
   getPeople() {
     let q = window.location.hash.split('question=')[1];
     let arr = [];
     $.ajax({
         url: '/search/getpeople',
         type: 'POST',
         data: {
           q: q
         },
         success: function(data) {
           data.map(function(item) {
             arr.push(item);
           });
           this.setState({people: arr});
           this.isFollow();
           this.getUserProfile();
         }.bind(this)
       });
   }
   // get the profile object of users fallowing the topic
   getUserProfile() {
    let q = window.location.hash.split('question=')[1];
     $.ajax({
         url: '/search/getuserprofile',
         type: 'POST',
         data: {
           q: q
         },
         success: function(data) {
          this.setState({profile: data});
          // console.log(this.state.profile);
         }.bind(this)
       });
   }
// to check wether a loged in user is fallowing the particular topic
   isFollowTopic() {
     let id = Cookie.load('email');
     let q = window.location.hash.split('question=')[1];
     $.ajax({
         url: '/search/isfollowtopic',
         type: 'POST',
         data: {
           name: id,
           q: q
         },
         success: function(data) {
           if(data.follow) {
             this.setState({
               followtopic: 'Following'
             });
           }
           else {
             this.setState({
               followtopic: 'Follow'
             });
           }
         }.bind(this)
       });
   }
// method to find if user is fallowing other user in that particular topic
   isFollow() {
     if(this.state.followtopic === 'Following') {
       return 0;
     }
     let id = Cookie.load('email');
     let arr = [];
     this.state.people.map(function(item) {
       arr.push(item);
     });
     arr = JSON.stringify(arr);
     $.ajax({
         url: '/search/isfollow',
         type: 'POST',
         data: {
            name: id,
            emailArray: arr
         },
         success: function(data) {
           this.setState({isfollow: data});
         }.bind(this)
       });
       return 1;
   }
// method to find out concepts in that particular topic
   getConcept() {
     let q = window.location.hash.split('question=')[1];
     $.ajax({
         url: '/search/getconcepts',
         type: 'POST',
         data: {
           concept: q
         },
         success: function(data) {
           this.setState({concept: data});
         }.bind(this)
       });
   }
// method to make user fallow a topic
   followTopic() {
     let q = window.location.hash.split('question=')[1];
     let id = Cookie.load('email');
     $.ajax({
         url: '/search/followtopic',
         type: 'POST',
         data: {
           id: id,
           concept: q
         },
         success: function() {
           let temp = 'Following';
           this.setState({followtopic: temp});
           this.setState({icon: 'minus circle'});
         }.bind(this)
      });
   }
   render() {
    const { active } = this.state;
       return (
             <div className='search1' >
                  <Dimmer active = {active} page>
                  <Loader>Searching Questions</Loader>
                 </Dimmer>
                 <Concepts json = {this.state.concept} ques = {this.state.followtopic}
                  followTopic = {this.followTopic.bind(this)} Icon = {this.state.icon}
                  topic = {window.location.hash.split('question=')[1]} />
                 <Categories changeComponent = {this.changeComponent.bind(this)}/>
                 {this.state.component}
             </div>
       );
   }
}
module.exports = Search;
