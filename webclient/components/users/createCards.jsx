import React from 'react';
import {Grid, Button, Image} from 'semantic-ui-react';
import {hashHistory} from 'react-router';
import $ from 'jquery';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class CreateCards extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            follow: []
        };
        this.locAlert = this.locAlert.bind(this);
    }
    locAlert () {
        this.refs.container.error(
          'Please Select Atleast One Category',
          '', {
          timeOut: 1000,
          extendedTimeOut: 10000
        });
      }
    setSelected(item)
    {
        // console.log('Set Selected', this.props.itemss);
        /* eslint-disable*/
        let context = this;
        /* eslint-enable*/
        // console.log(item);
        let temp = true;
        if(this.props.mongo)
        {
            context.props.itemss.map(function(item1)
                {
                    context.state.follow.push(item1);
                });
        }
            context.state.follow.map(function(items) {
                if (item === items) {
                    temp = false;
                }
            });
            if(temp)
            {
                context.state.follow.push(item);
                context.props.addCategories(context.state.follow, context.props.categories);
            }
            else
            {
                let i = context.state.follow.indexOf(item);
                if(i !== -1) {
                    context.state.follow.splice(i, 1);
                    // console.log(context.state.follow);
                    context.props.addCategories(context.state.follow, context.props.categories);
                }
            }
    }
    componentWillMount() {
        // console.log(this.props.itemss);
        // this.setState({follow: this.props.itemss});
        // console.log(this.state.follow);
    }

    submitCatagory()
    {
        if(this.state.follow.length === 0)
        {
            /* eslint-disable*/
            this.locAlert();
            /* eslint-enable*/
        }
        else
        {
            // console.log(this.state.follow);
        let jObject = {};
        jObject = JSON.stringify(this.state.follow);
        $.ajax({
            url: '/users/addCatagory',
            type: 'post',
            data: {
                catagory: jObject,
                email: this.props.email,
                profilePicture: this.props.profilePic,
                name: this.props.userName
            },
            success: function() {
                // console.log('Successfully got JSON Catagory' + JSON.stringify(data));
                $.ajax({
                    url: '/users/updateIsNew/' + this.props.email,
                    type: 'put',
                    data: {
                        isNew: 'N'
                    },
                    success: function() {
                        // console.log(Cookie.load('email'));
                        hashHistory.push('/userProfile');
                    },
                    error: function() {
                        // console.log('error occurred on AJAX for update');
                    }
                });
            }.bind(this),
            error: function() {
                // console.log('error occurred on AJAX');
                // console.log(err);
            }
        });
        }
    }
    render()
    {
        // console.log(this.props.itemss);
        /* eslint-disable */
        let context = this;
        let cardButton;
        let show;
        let present = false;
        /* eslint-enable */
            let data = this.props.categories.map(function(item) {
            let tempButtom = true;
            context.props.itemss.map(function(category) {
                // console.log(item);
                if(item.name === category)
                {
                    tempButtom = false;
                }
            });
            if(tempButtom)
            {
                // console.log('in if');
                cardButton = null;
                show = true;
            }
            else
            {
                /* eslint-disable */
                // console.log('in else');
cardButton = <Image src='https://8biticon.com/static/images/tick.png' style={{height: 50 + 'px',
marginLeft: -31 + 'px',marginTop: -67 + 'px'}}/>;
            show = false;
            }
            // console.log('card Buttton: ', cardButton)
            return (
                <div style = {{marginLeft: 38 + 'px',marginTop: -27 + 'px'}}>
                <Grid.Column style = {{marginBottom: 30 + 'px',marginTop: 60 + 'px'}} >
        <Image src = {item.image} style = {{height: 250 + 'px', width: 250 + 'px'}} shape = 'circular'
        onClick={() => context.setSelected(item.name)} disabled = {show}/>
               </Grid.Column>
               <div style={{marginLeft: 134 + 'px', marginTop: -22 + 'px'}}>{cardButton}</div>
               </div>
            );
        });

        return (
            <div className = "selectCat">
              <div className='scroll-left'>
            Welcome to Zynla.Please Choose Your Area Of Interest
          </div>

                <Grid.Row>
                    <Grid.Column width = {12} style = {{width: 800 + 'px'}}>
                        <Grid stackable columns = {3} style = {{width: 1081 + 'px', marginLeft: 115 + 'px'}}>
                            {data}
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width = {4} style = {{float: 'right', marginTop: -355 + 'px'}}>
                    <Button primary content = 'Next' icon = 'right arrow' labelPosition='right'
                    onClick={this.submitCatagory.bind(this)} style={{marginRight: 30 + 'px',
                    marginTop: 70 + 'px'}}/>
                    </Grid.Column>
                </Grid.Row>
        <ToastContainer ref='container' toastMessageFactory={ToastMessageFactory}
                       className='toast-top-center' />
        </div>
        );
    }
}
/* eslint-enable */
CreateCards.propTypes = {
    email: React.PropTypes.string.isRequired,
    categories: React.PropTypes.array.isRequired,
    addCategories: React.PropTypes.func.isRequired,
    profilePic: React.PropTypes.string,
    userName: React.PropTypes.string,
    mongo: React.PropTypes.boolean,
    itemss: React.PropTypes.array.isRequired
};
export default CreateCards;
