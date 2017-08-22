import React from 'react';
import Cookie from 'react-cookie';
import {
    Image,
    Card,
    Icon,
    Menu,
    Divider,
    Button,
    Modal,
    TextArea,
    Form
} from 'semantic-ui-react';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
let menucommentstyle = {
  fontSize: 14
};
let poststyle1 = {
    fontFamily: 'Georgia',
    fontSize: 15,
    fontWeight: 'serif'
};
let ansstyle = {
    fontFamily: 'Cochin',
    fontWeight: 'serif',
    fontSize: 21
};
let commentstyle = {
    fontFamily: 'Cochin',
    fontSize: 14
};
let formstyle = {
    margin: '3% 3% 3% 3% '
};
let commentbutton = {
  marginBottom: '2%',
  marginLeft: '5%'
};
let commentbutton1 = {
  marginRight: '3%'
};
class cardAnswer extends React.Component {
    constructor() {
        super();
        this.state = {
            modalState: false,
            isAccepted: false,
            btnValue: 'Accept'
        };
        this.addAnswercomment = this.addAnswercomment.bind(this);
        this.locAlert = this.locAlert.bind(this);
    }
    comment(e) {
       this.setState({comment: e.target.value});
   }
   commentclose() {
     this.setState({modalState: false});
   }
   locAlert() {
    //  console.log('inside localert');
   this.refs.container.success(
     'Updated Successfully',
     '', {
     timeOut: 1000,
     extendedTimeOut: 10000
   });
   }
   changeModalState(x, y) {
     // console.log(y);
     if(y === false) {
       this.setState({
         modalState: false
       });
     }
     else {
       this.setState({
         modalState: true
       });
     }
   }

   addAnswercomment() {
       // console.log('views before increment');
         let id = this.props.id;
         /* eslint-disable */
         let context = this;
         /* eslint-enable */

       let commentdata = {
           answerId: id,
           mail: Cookie.load('email'),
           content: this.state.comment
       };
       // console.log("comments:"+commentdata);
       $.ajax({
           url: '/list/addanswerComment',
           type: 'PUT',
           data: commentdata,
           success: function() {
             // console.log('insisde success');
             context.changeModalState(123, false);
             context.locAlert();
               // this.setState({comment: Comments});
               // console.log('inside success', this.state.commentdata);
           }
       });
   }
    updateAcceptAns()
    // accepting the answer by user (by sumit on 11/3/2017 )
    {
        let email = Cookie.load('email');
        let id = this.props.id;
        let questionId = this.props.quesId;
        // console.log('Question:' + questionId + '\nAnswer:' + id);
        let ansdata = {
            questionId: questionId,
            id: id,
            email: email
        };
        /*eslint-disable*/
        let context = this;
        /*eslint-enable*/
        $.ajax({
            url: '/list/UpdateAcceptans',
            type: 'POST',
            data: ansdata,
            success: function() {
                context.setState({isAccepted: true, btnValue: 'Accepted'});
            },
            error: function() {}
        });
    }
    render() {
        // accepting the answer by user (by sumit on 10/3/2017 )
        let accept = '';
        let btn = (
            <Button primary onClick={this.updateAcceptAns.bind(this)}>{this.state.btnValue}</Button>
        );
        if (this.props.isAccepted) {
            accept = (<Icon name='checkmark' size='large' color='green'/>);
        } else if (Cookie.load('email') === this.props.postedBy) {
            accept = btn;
        }
        else {
          accept = (<Icon name='checkmark' size='large' color='grey'/>);
        }
        let ansHtmlContent = this.props.content;
        // displaying answer in answerpage created by Aswini K
        return (
            <div>

                <Card fluid>
                    <Card.Content style={poststyle1}>
                        <Image floated='left' size='mini'
                          src='http://semantic-ui.com/images/avatar/large/steve.jpg'/>
                        <a>
                            {this.props.createdBy}
                        </a>
                        <div>Answered on
                          {new Date(parseInt(this.props.createdOn, 10))
                            .toString().substring(0, 15)}</div>
                    </Card.Content>
                    <Card.Content style={ansstyle}>
                            <div className='content'
                              dangerouslySetInnerHTML={{__html: ansHtmlContent}} />
                    </Card.Content>
                    <Menu style={commentstyle}>
                        <Menu.Item>
                            <Icon name='thumbs up' size='large' color='green'/>
                            {this.props.upvote}
                        </Menu.Item>
                        <Menu.Item>
                            <Icon name='thumbs down' size='large' color='red'/>
                            {this.props.downvote}
                        </Menu.Item>
                        <Menu.Item>
                            {accept}
                        </Menu.Item>
                        <Menu.Item>
                          <Modal trigger={<Button basic color = 'black'
                             onClick = {this.changeModalState.bind(this)}
                              size = 'mini' style = {menucommentstyle}> Add Comments </Button>}
                           open = {this.state.modalState}>
                              <Form style={formstyle}>
                                  <TextArea onChange={this.comment.bind(this)}
                                     onClick = {this.changeModalState.bind(this)}
                                      value={this.state.comment}/>
                              </Form>
                              <Button style={commentbutton1} negative content='Cancel'
                                floated='right' onClick={this.commentclose.bind(this)}/>
                              <Button style={commentbutton} content='Submit' primary
                                 onClick={this.addAnswercomment.bind(this)} floated='right'/>
                          </Modal>
                          <ToastContainer ref='container'
                            toastMessageFactory={ToastMessageFactory}
                            className='toast-top-center' />
                        </Menu.Item>
                      </Menu>
                </Card>
                <Divider clearing/>
            </div>
        );
    }
}
cardAnswer.propTypes = {
    createdBy: React.PropTypes.string.isRequired,
    createdOn: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired,
    upvote: React.PropTypes.number.isRequired,
    downvote: React.PropTypes.number.isRequired,
    isAccepted: React.PropTypes.bool,
    id: React.PropTypes.number,
    quesId: React.PropTypes.number.isRequired,
    postedBy: React.PropTypes.string.isRequired

};
module.exports = cardAnswer;
