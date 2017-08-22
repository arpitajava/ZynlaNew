import React from 'react';
import Cookie from 'react-cookie';
import AnswersCard from './answersCard';
import {
   Dimmer,
   Loader
} from 'semantic-ui-react';
class displayAnswers extends React.Component {

  handleOpen = () => this.setState({ active: true })
  handleClose = () => this.setState({ active: false })
   constructor() {
       super();
       this.state = {
         answerobj: []
       };
     }

     componentWillMount() {
          this.handleOpen();
          this.getAnswers();
     }
     getAnswers() {
       let email = Cookie.load('email');
       /*eslint-disable*/
       let context = this;
       /*eslint-enable*/
       // console.log(email);
         $.ajax({
             url: '/userdoc/getAnswers',
             type: 'POST',
             data: {email: email},
             success: function(data) {
               context.handleClose();
               context.setState({answerobj: data});
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
          <Loader>Your Answers on the way...</Loader>
        </Dimmer>
         <h1 style={{marginLeft: '10px'}}>My Answers</h1>
          <AnswersCard answerData={this.state.answerobj}/>
        </div>
      );
    }
}
module.exports = displayAnswers;
