import React from 'react';
import {
  Button,
    Input,
    Dimmer,
    Loader,
    Menu,
    Grid,
    Segment,
    Popup,
    TextArea
} from 'semantic-ui-react';
import Cookie from 'react-cookie';
import InterestsCard from './interestedCategories/interestsCard';
const ReactToastr = require('react-toastr');
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);
class basicInfo extends React.Component {

    handleOpen = () => this.setState({active: true})
    handleClose = () => this.setState({active: false})
    constructor() {
        super();
        this.state = {
            loader: false,
            activeItem: '',
            primary: '',
            secondary: '',
            university: '',
            line1: '',
            line2: '',
            region: '',
            country: '',
            postalCode: '',
            city: '',
            description: '',
            dob: '',
            gender: '',
            phone: 'Phone',
            interestsData: [],
            justData: '',
            profileForm: <div style={{fontFamily: 'Segoe UI'}}>
                        <div>
                        View/update your profile data here.
                      </div>
                      <div>Use <strong>Profile Bot</strong> for an Interactive Experience</div>
                    </div>
        };

        this.handleItemClick1 = this.handleItemClick1.bind(this);
        this.handleItemClick2 = this.handleItemClick2.bind(this);
        this.handleItemClick3 = this.handleItemClick3.bind(this);
        this.handleItemClick4 = this.handleItemClick4.bind(this);
        this.updateEducation = this.updateEducation.bind(this);
        this.eduAlert = this.eduAlert.bind(this);
        this.locAlert = this.locAlert.bind(this);
        this.abtAlert = this.abtAlert.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateAbout = this.updateAbout.bind(this);
    }
    handleItemClick1() {
      this.getProfile();
      this.props.statusMeter();
      this.setState({
        profileForm: <div>
                <Popup on = 'click' trigger={<a style={{cursor: 'pointer'}}>
                  {this.state.description}</a>}
                flowing hoverable>
                <TextArea onChange={this.changeDescription.bind(this)}/>
                <Button onClick = {this.updateAbout.bind(this)} content='Update'/>
              </Popup><br/> born on <Popup on = 'click' trigger=
                {<a style={{cursor: 'pointer'}}>{this.state.dob}</a>}
                 flowing hoverable>
                 <Input onChange={this.changeDob.bind(this)} onKeyPress =
                 {this.changeDob.bind(this)}/>
                 <Button onClick = {this.updateAbout.bind(this)} content='Update'/>
               </Popup>. My Phone number is <Popup on = 'click' trigger=
                {<a style={{cursor: 'pointer'}}>{this.state.phone}</a>}
              flowing hoverable>
              <Input onChange={this.changePhone.bind(this)} onKeyPress =
              {this.changePhone.bind(this)}/>
              <Button onClick = {this.updateAbout.bind(this)} content='Update'/>
              </Popup>
        </div>,
            activeItem: 'Personal'
      });
    }
    handleItemClick2() {
      this.getProfile();
      this.props.statusMeter();
      this.setState({
        profileForm: <div>
            I did my schooling from <Popup on = 'click' trigger=
                {<a style={{cursor: 'pointer'}}>{this.state.primary}</a>}
                flowing hoverable>
                <Input onChange={this.changePrimary.bind(this)} onKeyPress =
                {this.changePrimary.bind(this)}/>
                <Button onClick = {this.updateEducation} content='Update'/>
              </Popup> . earned my degree <br/> from <Popup on = 'click'
                  trigger={<a style={{cursor: 'pointer'}}>{this.state.university}</a>}
                 flowing hoverable>
                 <Input onChange={this.changeUniversity.bind(this)} onKeyPress =
                 {this.changeUniversity.bind(this)}/>
                 <Button onClick = {this.updateEducation} content='Update'/>
                 </Popup> . and completed the high schooling from <Popup on = 'click' trigger=
                {<a style={{cursor: 'pointer'}}>{this.state.secondary}</a>}
              flowing hoverable>
              <Input onChange={this.changeSecondary.bind(this)} onKeyPress =
              {this.changeSecondary.bind(this)}/>
              <Button onClick = {this.updateEducation} content='Update'/>
              </Popup>
            </div>,
            activeItem: 'Education'
      });
    }
    handleItemClick3() {
      this.getProfile();
      this.props.statusMeter();
      this.setState({
        profileForm: <div>
            I Live at <Popup on = 'click' trigger=
              {<a style={{cursor: 'pointer'}}>{this.state.line1}</a>}
                flowing hoverable>
                <Input onChange={this.changeLine1.bind(this)} onKeyPress =
                {this.changeLine1.bind(this)}/>
                <Button onClick = {this.updateLocation.bind(this)} content='Update'/>
              </Popup><br/>, <Popup on = 'click' trigger=
                {<a style={{cursor: 'pointer'}}>{this.state.line2}</a>}
                 flowing hoverable>
                 <Input onChange={this.changeLine2.bind(this)} onKeyPress =
                 {this.changeLine2.bind(this)}/>
                 <Button onClick = {this.updateLocation.bind(this)} content='Update'/>
               </Popup>. in <Popup on = 'click' trigger=
                {<a style={{cursor: 'pointer'}}>{this.state.city}</a>}
              flowing hoverable>
              <Input onChange={this.changeCity.bind(this)} onKeyPress =
              {this.changeCity.bind(this)}/>
              <Button onClick = {this.updateLocation.bind(this)} content='Update'/>
              </Popup>. in <Popup on = 'click' trigger=
               {<a style={{cursor: 'pointer'}}>{this.state.region}</a>}
             flowing hoverable>
             <Input onChange={this.changeRegion.bind(this)} onKeyPress =
             {this.changeRegion.bind(this)}/>
             <Button onClick = {this.updateLocation.bind(this)} content='Update'/>
           </Popup>. postalCode: <Popup on = 'click' trigger=
              {<a style={{cursor: 'pointer'}}>{this.state.postalCode}</a>}
            flowing hoverable>
            <Input onChange={this.changePostalCode.bind(this)} onKeyPress =
            {this.changePostalCode.bind(this)}/>
            <Button onClick = {this.updateLocation.bind(this)} content='Update'/>
            </Popup> <Popup on = 'click' trigger=
             {<a style={{cursor: 'pointer'}}>{this.state.country}</a>}
           flowing hoverable>
           <Input on={this.changeCountry.bind(this)} value ={this.state.country} onKeyPress =
           {this.changeCountry.bind(this)}/>
           <Button onClick = {this.updateLocation.bind(this)} content='Update'/>
           </Popup>
        </div>,
            activeItem: 'Location'
      });
    }
    handleItemClick4() {
    this.setState({activeItem: 'Categories',
    profileForm: <InterestsCard interestData={this.state.interestsData}/>});
    }


//         let data;
//         if (name === 'Education') {
//             data = (
//               <div>
//                 <Form action='#/profile'>
//   <Form.Field>
//     <label>Primary</label>
//     <Input size = 'small' placeholder={this.state.primary}
//       onChange={this.changePrimary.bind(this)}/>
//   </Form.Field>
//   <Form.Field>
//     <label>Secondary</label>
//     <Input placeholder={this.state.secondary} onChange={this.changeSecondary.bind(this)} />
//   </Form.Field>
//   <Form.Field>
//     <label>University</label>
//     <Input placeholder={this.state.university} onChange={this.changeUniversity.bind(this)} />
//   </Form.Field>
// </Form>
// <Button onClick = {this.updateEducation.bind(this)}>Update</Button>
//               </div>
//                           );
//         } else if (name === 'Location') {
//             data = (
//
//               <div>
//                 <Form>
//                         <Form.Field>
//                             <label>Line1</label>
//                             <Input onChange={this.changeLine1.bind(this)}
                                // placeholder={this.state.line1}/>
//                         </Form.Field>
//                         <Form.Field>
//                             <label>Line2</label>
//                             <Input onChange={this.changeLine2.bind(this)}
//                              placeholder={this.state.line2}/>
//                         </Form.Field>
//                         <Form.Field>
//                             <label>City</label>
//                             <Input onChange={this.changeCity.bind(this)}
// placeholder={this.state.city}/>
//                         </Form.Field>
//                         <Form.Field>
//                             <label>Region</label>
//                             <Input onChange={this.changeRegion.bind(this)}
                                // placeholder={this.state.region}/>
//                         </Form.Field>
//                         <Form.Field>
//                             <label>Postal Code</label>
//                             <Input onChange={this.changePostalCode.bind(this)}
// placeholder={this.state.postalCode}/>
//                         </Form.Field>
//                         <Form.Field>
//                             <label>Country</label>
//                             <Input onChange={this.changeCountry.bind(this)}
  // placeholder={this.state.country}/>
//                         </Form.Field>
//                     </Form>
//                     <Button onClick={this.updateLocation.bind(this)}>Update</Button>
//               </div>
//             );
//         } else if (name === 'Personal') {
//             data = (
//               <div>
//                     <Form action='?#/profile'>
//                         <Form.Field>
//                             <label>Picture</label>
//                             <Input placeholder={this.state.picture}
// onChange={this.changePhoto.bind(this)}/>
//                         </Form.Field>
//                         <Form.TextArea label='Description'
// placeholder={this.state.description} onChange={this.changeDescription.bind(this)}/>
//                         <Form.Field>
//                             <label>Date Of Birth</label>
//                             <Input placeholder={this.state.dob}
// onChange={this.changeDob.bind(this)}/>
//                         </Form.Field>
//                         <Form.Field>
//                             <label>Gender</label>
//                             <Input placeholder={this.state.gender}
 // onChange={this.changeGender.bind(this)}/>
//                         </Form.Field>
//                         <Form.Field>
//                             <label>Phone</label>
//                             <Input placeholder={this.state.phone}
// onChange={this.changePhone.bind(this)}/>
//                         </Form.Field>
//                     </Form>
//                     <Button onClick={this.updateAbout.bind(this)}>Update</Button>
//                 </div>
//             );
//         } else if (name === 'Categories') {
//             data = (<InterestsCard interestData={this.state.interestsData}/>);
//         }
//         this.setState({activeItem: name, profileForm: data});
    changePrimary(e) {
        this.setState({primary: e.target.value});
        if(e.key === 'Enter') {
          this.updateEducation();
        }
    }
    changeSecondary(e) {
        this.setState({secondary: e.target.value});
        if(e.key === 'Enter') {
          this.updateEducation();
        }
    }
    changeUniversity(e) {
        this.setState({university: e.target.value});
        if(e.key === 'Enter') {
          this.updateEducation();
        }
    }
    changeLine1(e) {
        this.setState({line1: e.target.value});
        if(e.key === 'Enter') {
          this.updateLocation();
        }
    }
    changeLine2(e) {
        this.setState({line2: e.target.value});
        if(e.key === 'Enter') {
          this.updateLocation();
        }
    }
    changeCountry(e) {
        this.setState({country: e.target.value});
        if(e.key === 'Enter') {
          this.updateLocation();
        }
    }
    changeRegion(e) {
        this.setState({region: e.target.value});
        if(e.key === 'Enter') {
          this.updateLocation();
        }
    }
    changeCity(e) {
        this.setState({city: e.target.value});
        if(e.key === 'Enter') {
          this.updateLocation();
        }
    }
    changePostalCode(e) {
        this.setState({postalCode: e.target.value});
        if(e.key === 'Enter') {
          this.updateLocation();
        }
    }
    changeDescription(e) {
        this.setState({description: e.target.value});
        if(e.key === 'Enter') {
          this.updateAbout();
        }
    }
    changeDob(e) {
        this.setState({dob: e.target.value});
        if(e.key === 'Enter') {
          this.updateAbout();
        }
    }
    changeGender(e) {
        this.setState({gender: e.target.value});
        if(e.key === 'Enter') {
          this.updateAbout();
        }
    }
    changePhone(e) {
        this.setState({phone: e.target.value});
        if(e.key === 'Enter') {
          this.updateAbout();
        }
    }
    handleChange = (e, {value}) => this.setState({value})
    componentDidMount() {
        // console.log('comes');
        this.handleOpen();
        this.getProfile();
        this.getInterestedTopics();
    }
    getProfile() {
      /*eslint-disable*/
      let context = this;
      /*eslint-enable*/
            $.ajax({
            url: '/userdoc/getuserprofile',
            type: 'post',
            data: {
                email: Cookie.load('email')
            },
            success: function(data) {
                context.handleClose();
                    context.setState({
                        primary: data.profile.education.primary,
                        secondary: data.profile.education.highSchool,
                        university: data.profile.education.university,
                        line1: data.profile.address.Line1,
                        line2: data.profile.address.Line2,
                        country: data.profile.address.country,
                        region: data.profile.address.region,
                        city: data.profile.address.city,
                        postalCode: data.profile.address.postalCode,
                        description: data.profile.description,
                        dob: data.profile.dob,
                        gender: data.profile.gender,
                        phone: data.profile.phone
                    });
            },
            error: function() {

            }
        });
    }
    updateEducation() {
        let eduData = {
            primary: this.state.primary,
            highSchool: this.state.secondary,
            university: this.state.university,
            emailId: Cookie.load('email')
          };
          /*eslint-disable*/
          let context = this;
          /*eslint-enable*/
            $.ajax({
            url: '/userdoc/updateEdu',
            type: 'POST',
            data: eduData,
            success: function() {
              context.eduAlert();
              context.handleItemClick2();
                /*eslint-disable*/
                /*eslint-enable*/
                // console.log(data);
            },
            error: function() {
                // console.error(err.toString());
            }
        });
      }
    updateLocation() {
        let locData = {
            Line1: this.state.line1,
            Line2: this.state.line2,
            country: this.state.country,
            region: this.state.region,
            city: this.state.city,
            postalCode: this.state.postalCode,
            email: Cookie.load('email')
        };
        /*eslint-disable*/
        let context = this;
        /*eslint-enable*/
        //   // console.log(JSON.stringify(locData);
        $.ajax({
            url: '/userdoc/updateLoc',
            type: 'POST',
            data: locData,
            success: function() {
            context.locAlert();
            context.handleItemClick3();
            },
            error: function() {
                // console.error(err.toString());
            }
        });
    }

    updateAbout() {
        let proData = {
            description: this.state.description,
            dob: this.state.dob,
            gender: this.state.gender,
            phone: this.state.phone,
            email: Cookie.load('email')
        };
        //   // console.log(JSON.stringify(proData);
        /*eslint-disable*/
        let context = this;
        /*eslint-enable*/
        $.ajax({
            url: '/userdoc/updatePro',
            type: 'POST',
            data: proData,
            success: function() {
              context.abtAlert();
              context.handleItemClick1();
            },
            error: function() {
                // console.error(err.toString());
            }
        });
    }
    getInterestedTopics() {
        $.ajax({
            url: '/userdoc/getInterestedTopics',
            type: 'POST',
            data: {
                email: Cookie.load('email')
            },
            success: function(data) {
                this.setState({interestsData: data});
            }.bind(this),
            error: function() {
                // console.error(err.toString());
            }
        });
    }
    eduAlert () {
       this.refs.container.success(
         'Updated Education Successfully',
         '', {
         timeOut: 1000,
         extendedTimeOut: 10000
       });
     }
     locAlert () {
        this.refs.container.success(
          'Location Updated Successfully',
          '', {
          timeOut: 1000,
          extendedTimeOut: 10000
        });
      }
      abtAlert () {
         this.refs.container.success(
           'Personal Details updated Successfully',
           '', {
           timeOut: 1000,
           extendedTimeOut: 10000
         });
       }
    render() {
        const {active} = this.state;
        const {activeItem} = this.state;

        return (

                      <div>

                <Dimmer active={active} page>
                    <Loader>Fetching your profile</Loader>
                </Dimmer>
                <Grid>
                    <Grid.Column width={4}>

                        <Menu style={{fontFamily: 'Georgia, serif'}}
                          fluid vertical tabular>
                              <Menu.Item name='Personal'
                                active={activeItem === 'Personal'}
                                onClick={this.handleItemClick1.bind(this)}/>
                              <Menu.Item name='Education' active={activeItem === 'Education'}
                              onClick={this.handleItemClick2.bind(this)}/>
                            <Menu.Item name='Location' active={activeItem === 'Location'}
                              onClick={this.handleItemClick3.bind(this)}/>
                            <Menu.Item name='Categories'
                              active={activeItem === 'Categories'}
                              onClick={this.handleItemClick4.bind(this)}/>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column stretched width={12}>
                        <Segment style={{fontWeight: '600', fontSize: '20px', lineHeight: '25px'}}>
                          <br/>
                            {this.state.profileForm}
                        </Segment>
                    </Grid.Column>
                </Grid>
                <ToastContainer ref='container' style ={{backgroundColor: '#B2242E'}}
                       toastMessageFactory={ToastMessageFactory}
                       className='toast-top-center' />
            </div>
        );
    }
}
module.exports = basicInfo;
basicInfo.propTypes = {
  statusMeter: React.PropTypes.function
};
