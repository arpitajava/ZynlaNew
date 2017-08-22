import {PropTypes} from 'react';
import RichTextEditor from 'react-rte';
import React from 'react';
import {
    Grid,
    Image,
    Button,
    Divider,
    Icon,
    Breadcrumb,
    Segment,
    Form,
    Modal,
    TextArea,
    Popup,
    Checkbox,
    Dimmer,
    Loader,
    Header
} from 'semantic-ui-react';
import Cookie from 'react-cookie';
// import RichTextEditor from 'react-rte';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
const DisplayAnswer = require('./answerDisplay');
let titlestyle = {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '5%'
};
let questionstyle = {
    fontSize: 18,
    marginTop: '3%',
    lineHeight: '30px'
};
let buttonfolstyle = {
    marginLeft: '3%'
};
let crumstyle = {
    marginTop: '2%'
};
let viewstyle = {
    marginLeft: '3%'
};
let likestyle = {
    marginLeft: '3%'
};
let unlikestyle = {
    marginLeft: '3%'
};
let ansstyle1 = {
    marginTop: '3%',
    fontSize: 20
};
let followstyle = {
    float: 'right',
    backgroundcolor: '#BE252A  ',
    color: '#FFFFFF  '
};
let formstyle = {
    margin: '3% 3% 3% 3% '
};
let titlestyle1 = {
    fontFamily: 'Georgia',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '1%',
    marginBottom: '3%'
};
let date = {
    marginTop: '1%',
    fontSize: 15
};
let commentbutton = {
  marginBottom: '2%',
  marginLeft: '5%'
};
let commentbutton1 = {
  marginRight: '3%'
};
class answerPage extends React.Component {
    constructor() {
        super();
        this.state = {
          modalState: false,
            active: false,
            open: true,
            value: RichTextEditor.createEmptyValue(),
            id: '',
            warnModalStatus: false,
            views: 0,
            upVotes: 0,
            downVotes: 0,
            colorName: 'green',
            colorNameUnlike: 'red',
            iconName: 'add',
            report: '',
            reportResult: '',
            popupResult: '',
            objArray: [
                {
                    id: 0,
                    category: '',
                    tags: '',
                    heading: '',
                    question: '',
                    image: '',
                    displayImage: '',
                    profileImage: '',
                    addedOn: '',
                    upVotes: '',
                    downVotes: '',
                    answerCounts: '',
                    postedBy: '',
                    views: 0,
                    topCards: [
                        {
                            createdBy: '',
                            content: '',
                            createdOn: '',
                            image: '',
                            profileImage: '',
                            upVote: 0,
                            downVote: 0,
                            isAccepted: true
                        }
                    ],
                    status: {
                        open: true
                    }
                }
            ]
        };
        this.textVal = this.textVal.bind(this);
        this.getviewscount = this.getviewscount.bind(this);
        this.getData = this.getData.bind(this);
        this.postAnswer = this.postAnswer.bind(this);
        this.addcomment = this.addcomment.bind(this);
        this.locAlert = this.locAlert.bind(this);
    }
    static propTypes = {
        onChange: PropTypes.func
    };
    commentclose() {
      this.setState({modalState: false});
    }
    locAlert() {
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

    onChange = (value) => {
        this.setState({value});
        if (this.props.onChange) {
            this.props.onChange(value.toString('html'));
        }
    };

    handleCloseAnswer = () => {
      this.setState({
      warnModalStatus: false,
      modalStatus: false
  });
}
    modalOpen() {
        this.setState({modalStatus: true});
    }
    textVal(e) {
        this.setState({content: e.target.value});
    }
    comment(e) {
        this.setState({comment: e.target.value});
    }
    // Posting answer for question created by Aswini K
    postAnswer() {
      if((this.state.value.toString('html')).length > 11) {
        this.close();
        let id = window.location.hash.split('id=')[1];
        // console.log('inside post Answer');
        let ansdata = {
            questionId: id,
            mail: Cookie.load('email'),
            content: this.state.value.toString('html')
        };
        /* eslint-disable */
        let context = this;
        /* eslint-enable */
        // console.log(JSON.stringify(ansdata));
        $.ajax({
            url: '/answers/add',
            type: 'POST',
            data: ansdata,
            success: function() {
                // console.log('success', data);
                context.setState({active: false});
                context.getData();
            },
            error: function() {
                // console.log(this.props.url, status, err.toString());
            }
        });
    }
    else {
      this.setState({errormsg: true});
    }
  }
    // Getting views count created by Aswini K
    getviewscount() {
        // console.log('views before increment', this.state.views);
        let id = window.location.hash.split('id=')[1];

        let viewscount = this.state.views + 1;

        $.ajax({
            url: '/list/updateviews',
            type: 'PUT',
            data: {
                id: id,
                views: viewscount
            },
            success: function() {
                this.setState({views: viewscount});
                // console.log('inside success', this.state.views);
            }.bind(this)
        });
    }
    // Adding comments for question created by Aswini K
    addcomment() {
        // console.log('views before increment');
        let id = window.location.hash.split('id=')[1];
        /* eslint-disable */
        let context = this;
        /* eslint-enable */
        let commentdata = {
            questionId: id,
            mail: Cookie.load('email'),
            content: this.state.comment
        };
        // console.log("comments:"+commentdata);
        $.ajax({
            url: '/list/updatecomment',
            type: 'PUT',
            data: commentdata,
            success: function() {
                context.changeModalState(123, false);
                context.locAlert();
                // this.setState({comment: Comments});
                // console.log('inside success', this.state.commentdata);
            }
        });
    }
    // Getting question data from mongo db created by Aswini K
    getData() {
        let id = window.location.hash.split('id=')[1];
        this.handleOpen();
        $.ajax({
            url: '/list/answer/' + id,
            type: 'GET',
            success: function(data) {
                this.setState({objArray: data});
                this.setState({views: data[0].views});
                this.getviewscount();
                this.handleClose();
                // console.log(this.state.objArray);
            }.bind(this)
        });
    }
    componentWillMount() {
        this.getData();
        this.getLikeStatus();
        this.CheckingId();
    }
    // updating like for question by sumit(28/2/2017)
    updatelike() {
      if(this.state.colorNameUnlike !== 'black') {
        let type = 'add';
        let color = 'blue';
        let upVotesTemp = parseInt(this.state.upVotes, 10) + 1;
        if (this.state.colorName === 'green') {
            type = 'add';
            upVotesTemp = parseInt(this.state.upVotes, 10) + 1;
            color = 'blue';
        } else {
            type = 'delete';
            upVotesTemp = parseInt(this.state.upVotes, 10) - 1;
            color = 'green';
        }
        let id = window.location.hash.split('id=')[1];
        // console.log('upvotes before increment',this.state.upVotes);
        // console.log('upvotes after increment',upVotesTemp);
        $.ajax({
            url: '/list/updateLike',
            type: 'POST',
            data: {
                id: id,
                upVotes: upVotesTemp,
                email: Cookie.load('email'),
                type: type
            },
            success: function() {
                // console.log('comes');
                this.setState({colorName: color, upVotes: upVotesTemp});
            }.bind(this)
        });
      }
    }
    // updating unlike for question by sumit(1/3/2017)
    updateunlike() {
        // console.log("coming to update unlike");
        if(this.state.colorName !== 'blue') {
        let type = 'add';
        let color = 'red';
        let downVotesTemp = parseInt(this.state.downVotes, 10) + 1;
        if (this.state.colorNameUnlike === 'red') {
            type = 'add';
            downVotesTemp = parseInt(this.state.downVotes, 10) + 1;
            color = 'black';
        } else {
            type = 'delete';
            downVotesTemp = parseInt(this.state.downVotes, 10) - 1;
            color = 'red';
        }
        let id = window.location.hash.split('id=')[1];
        $.ajax({
            url: '/list/updateunlike',
            type: 'POST',
            data: {
                id: id,
                downVotes: downVotesTemp,
                email: Cookie.load('email'),
                type: type
            },
            success: function() {
                this.setState({colorNameUnlike: color, downVotes: downVotesTemp});
            }.bind(this)
        });
      }
    }
    // updating status of the button (color)for question by sumit(1/3/2017)
    getLikeStatus() {
        let id = window.location.hash.split('id=')[1];
        let email = Cookie.load('email');
        $.ajax({
            url: '/list/likestatus',
            type: 'POST',
            data: {
                id: id,
                email: email
            },
            success: function(data) {
                // console.log(data);
                if (data.like) {
                    this.setState({colorName: 'blue'});
                } else {
                    this.setState({colorName: 'green'});
                }
                if (data.unlike) {
                    this.setState({colorNameUnlike: 'black'});
                } else {
                    this.setState({colorNameUnlike: 'red'});
                }
            }.bind(this)
        });
    }
    // Following the question created by Aswini K
    CheckingId() {
        let emailId = Cookie.load('email');
        let arr = [];
        $.ajax({
            url: `/users/viewFollowCard/${emailId}`,
            type: 'GET',
            success: function(data) {
                data.map(function(item) {
                    item.watchingList.map(function(items) {
                        arr.push(items);
                    });
                });
                for (let i = 0; i < arr.length; i = i + 1) {
                    if (this.props.id === arr[i].id) {
                        this.setState({iconName: 'minus'});
                    }
                }
            }.bind(this)
        });
    }
    /* To save the card which you follow in mongo db & Neo4j*/
    saveToProfile() {
        let id = window.location.hash.split('id=')[1];
        let emailId = Cookie.load('email');
        let quesObj = this.state.objArray;
        $.ajax({

           url: '/users/saveToProfile',
            type: 'PUT',
            data: {
                emailId: emailId,
                id: id,
                displayImage: quesObj[0].displayImage,
                heading: quesObj[0].heading,
                statement: quesObj[0].question,
                postedBy: quesObj[0].postedBy,
                profileImage: quesObj[0].profileImage,
                addedOn: quesObj[0].addedOn,
                views: quesObj[0].views,
                category: quesObj[0].category,
                upVotes: quesObj[0].upVotes,
                downVotes: quesObj[0].downVotes,
                answerCounts: quesObj[0].answerCounts
            },
            success: function() {
                this.setState({iconName: 'minus'});
            }.bind(this),
            error: function() {}
        });
    }
    close = () => this.setState({modalStatus: false})
    warningModal = () => {
      this.setState({warnModalStatus: true});
    }
    warningModalCancel = () => {
      this.setState({warnModalStatus: false});
    }
    /* ajax call To create a report for question by the user created by Soundar*/
    state = {}
    handleChange = (e, {value}) => this.setState({value})
    handleOpen() {this.setState({ active: true });}
    handleClose() {this.setState({ active: false });}
    changeType()
    {
        this.sendReport(this.state.value);
    }
    sendReport(value)
    {
        let id = window.location.hash.split('id=')[1];
        let email = Cookie.load('email');
        $.ajax({
            url: '/list/createReport',
            type: 'POST',
            data: {
                id: id,
                email: email,
                type: value
            },
            success: function(data) {
                this.setState({reportResult: data});
            }.bind(this),
            error: function() {}
        });
    }
    checkReport()
    {
        let id = window.location.hash.split('id=')[1];
        let email = Cookie.load('email');
        $.ajax({
            url: '/list/changePopup',
            type: 'POST',
            data: {
                id: id,
                email: email
            },
            success: function(data) {
                this.setState({popupResult: data});
            }.bind(this),
            error: function() {}
        });
    }

    render() {
      let errorMessage;
        let quesObj = this.state.objArray;
        let arr = quesObj[0].tags;
        let arr1 = arr.replace('["', ' ');
        let arr2 = arr1.replace('"]', ' ');
        let tags = arr2.replace('","', ' >> ');
        const {active} = this.state;
        let pop = '';
            let dateData = new Date(parseInt(quesObj[0].addedOn, 10)).toString().substring(0, 15);
        if (this.state.popupResult !== 'First Report') {
            pop = (
                <div>
                    <h4 id='h4'>You have already Reported as ....</h4>
                    <h4>{this.state.popupResult}</h4>
                </div>
            );
        } else {
            pop = (
                <div>
                    <Form>
                        <Form.Field>
                            <Checkbox radio label='Violent or crude content'
                               name='checkboxRadioGroup'
                                value='Violent or crude content'
                                 checked={this.state.value === 'Violent or crude content'}
                                  onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <Checkbox
                               radio label='Spam or Promotion of regulated goods and services'
                                name='checkboxRadioGroup'
                                 value='Spam or Promotion of regulated goods and services'
                                 checked={
                                   this.state.value
                                   === 'Spam or Promotion of regulated goods and services'
                                 }
                                   onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                            <Checkbox radio
                               label='Not relevant to the topic or category'
                                name='checkboxRadioGroup'
                                 value='Not relevant to the topic or category'
                                  checked={this.state.value
                                     ===
                                      'Not relevant to the topic or category'}
                                       onChange={this.handleChange}/>
                        </Form.Field>
                    </Form>
                    <div style={{
                        'text-align': 'center'
                    }}><Button
                       content='Report' color='red' onClick={this.changeType.bind(this)}/></div>
                    <p style={{
                        'text-align': 'center',
                        color: 'black',
                        fontWeight: 'bold'
                    }}>
                        {this.state.reportResult}</p>
                </div>
            );
        }
        if(this.state.errormsg) {
          errorMessage = (<div className='errorCss'>Please give your answer </div>);
        }else {
          errorMessage = '';
        }
        return (
            <div>
              <Dimmer active={active} page>
                <Loader>Loading</Loader>
              </Dimmer>
            <Grid divided='vertically'>
                <Grid.Row columns={3}>
                  <Grid.Column width={1}/>
                    <Grid.Column width={12}>
                        <div style={titlestyle} className='heading'>
                            {quesObj[0].heading}
                            <Button
                               circular style={followstyle}
                                icon={this.state.iconName}
                                 size='small' color='red' onClick={this.saveToProfile.bind(this)}/>
                        </div>
                        <div style={questionstyle} className='question'>
                            {quesObj[0].question}</div>
                        <Breadcrumb>
                            <Breadcrumb.Section link>{tags}</Breadcrumb.Section>
                        </Breadcrumb>
                        <Segment floated='right' size='big'>
                            <Image
                               floated='left'
                                size='mini'
                        src='{quesObj[0].profileImage}'/>
                            <a>
                                {quesObj[0].postedBy}
                            </a>
                            <div
                              style={date}>
                              {dateData}
                            </div>
                        </Segment>
                        <div style ={crumstyle}>

                            <Icon
                               style={likestyle}
                                name='thumbs up'
                                size='big' color={this.state.colorName || 'green'}
                                 onClick={this.updatelike.bind(this)}/> {this.state.upVotes}
                            <Icon style={unlikestyle} name='thumbs down'
                               size='big' color={this.state.colorNameUnlike || 'red'}
                                onClick={this.updateunlike.bind(this)}/> {this.state.downVotes}

                                <Popup
                                      trigger={<Icon name='eye' size='big' style={viewstyle}/>}
                                      content='Views'
                                    /> {quesObj[0].views + 1}
                            <Button basic color='green'
                               style={buttonfolstyle} size='mini'
                                onClick={this.modalOpen.bind(this)}>
                                Click to Answer
                            </Button>
                            <Modal open={this.state.modalStatus}>
                                <Modal.Content>
                                    <div style={titlestyle1}>
                                        {quesObj[0].heading}
                                    </div>
                                    <Form>{errorMessage}
                                      <RichTextEditor className='rteEditor'
                                            value={this.state.value}
                                            onChange={this.onChange}/>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color='green'
                                       onClick={this.postAnswer.bind(this)} type='button'>
                                        Submit
                                    </Button>
                                    <Button color='red' onClick={this.warningModal} >
                                      <Icon name='remove' /> Cancel</Button>
                                </Modal.Actions>
                            </Modal>
                            <Modal basic size='small' open={this.state.warnModalStatus}>
                            <Header icon='archive' content='Discard Answer' />
                            <Modal.Content>
                              <p>Are you sure to discard this Answer?</p>
                            </Modal.Content>
                            <Modal.Actions>
                            <Button color='green' inverted onClick={this.handleCloseAnswer}>
                              <Icon name='checkmark'/> Yes
                            </Button>
                              <Button basic color='red' inverted onClick={this.warningModalCancel}>
                                <Icon name='remove'/> No
                              </Button>
                            </Modal.Actions>
                          </Modal>
                            <Popup wide trigger={<Button negative style = {
                                buttonfolstyle
                            }
                            size = 'mini' onClick = {
                                this.checkReport.bind(this)
                            } > Report </Button>} on='click' position='bottom right' hideOnScroll>
                                {pop}
                            </Popup>
                            <Modal trigger={<Button basic color = 'black'
                               onClick = {this.changeModalState.bind(this)}
                                size = 'mini' style = {
                                buttonfolstyle
                            } > Add Comments </Button>}
                              open = {this.state.modalState} onClose={this.commentclose}>
                                <Form style={formstyle}>
                                    <TextArea onChange={this.comment.bind(this)}
                                       onClick = {this.changeModalState.bind(this)}
                                        value={this.state.comment}/>
                                </Form>
                                <Button style={commentbutton1} negative content='Cancel'
                                  floated='right' onClick={this.commentclose.bind(this)}/>
                                <Button style={commentbutton} content='Submit' primary
                                   onClick={this.addcomment.bind(this)} floated='right'/>
                            </Modal>
                            <ToastContainer ref='container'
                              toastMessageFactory={ToastMessageFactory}
                              className='toast-top-center' />
                        </div>
                        <div
                           style={ansstyle1}>{quesObj[0].answerCounts}&nbsp;
                            Answers</div>
                        <Divider clearing/>
                        <DisplayAnswer ansCollection={this.state.objArray}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
          </div>
        );
    }
}
answerPage.propTypes = {
    displayImage: React.PropTypes.string,
    heading: React.PropTypes.string,
    question: React.PropTypes.string,
    postedBy: React.PropTypes.string,
    addedOn: React.PropTypes.number,
    category: React.PropTypes.string,
    upVotes: React.PropTypes.string,
    downVotes: React.PropTypes.string,
    answerCounts: React.PropTypes.string,
    profileImage: React.PropTypes.string,
    views: React.PropTypes.number,
    acceptedCounts: React.PropTypes.string,
    remove: React.PropTypes.func,
    id: React.PropTypes.number
};
module.exports = answerPage;
