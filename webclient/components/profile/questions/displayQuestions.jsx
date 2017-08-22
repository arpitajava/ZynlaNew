import React from 'react';
import Cookie from 'react-cookie';
import QuestionsCard from './questionsCard';
import {
   Dimmer,
   Loader
} from 'semantic-ui-react';
class displayQuestions extends React.Component {

  handleOpen = () => this.setState({ active: true })
  handleClose = () => this.setState({ active: false })
   constructor() {
       super();
       this.state = {
         questionobj: []
       };
     }
     componentWillMount() {
          this.handleOpen();
          this.getQuestions();
     }
     getQuestions() {
       let email = Cookie.load('email');
       /*eslint-disable*/
       let context = this;
       /*eslint-enable*/
       // console.log(email);
         $.ajax({
             url: '/userdoc/getQuestions',
             type: 'POST',
             data: {email: email},
             success: function(data) {
               context.handleClose();
                  context.setState({questionobj: data});
             },
             error: function() {
              // console.log('error in logout' + err);
             }
         });
     }
   render() {
     const { active } = this.state;
       return (
         <div>
         <Dimmer active={active} page>
         <Loader>Your Questions on the way...</Loader>
       </Dimmer>
       <h1 style={{marginLeft: '10px'}}>Questions Posted</h1>
         <QuestionsCard questionData={this.state.questionobj}/>
       </div>
     );
   }
}
module.exports = displayQuestions;
