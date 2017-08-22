import React from 'react';
import PeopleCard from './peoplecard';
import {Card} from 'semantic-ui-react';
class People extends React.Component {
  constructor() {
    super();
  }

  render() {
    /* eslint-disable */
    let context = this;
    console.log(this.props.profile+"once it enters............");

    let photo = '';
    // map function to retrive the get the ID of users
    let allPeople = this.props.people.map(function(item, index) {
      let temp = '';
      let changedphoto = '';
      // map function to check the particular user is fallowing other user
      context.props.isfollow.map(function(item2) {
        if(item2.emailId === item) {
          temp = item2.follow;
        }
      });
      // map function to retrive profile pictures from profile
 context.props.profile.map(function(item3){
    console.log('coming');
     if(item3.email === item){
        photo = item3.photos;
        if(photo !== null)
       {
          changedphoto = photo.replace("sz=50","sz=250");

       }
       else
       {
        changedphoto = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=250';
       }
       }
      });
   return (
      < PeopleCard key = {index} id = {item} follow = {temp} photo = {changedphoto}/>
      );

    // console.log(context.props.profile);
    // console.log(index);
    // photo = context.props.profile[index];
    // if(photo !== undefined)
    // {
    //   let changedphoto = photo.photos.replace("sz=50","sz=250");
    // return <PeopleCard id = {item} follow = {temp} photo = {changedphoto}/>;
    // }
    // else
    // {
    //   photo = '';
    //   return <PeopleCard id = {item} follow = {temp} photo = {'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=250'}/>;
    // }

    });
         /* eslint-enable */
    return (
     <div style={{marginRight: 40 + 'px'}}>

       <Card.Group itemsPerRow = {4}>
                {allPeople}
                </Card.Group>

                </div>
    );
  }
}

module.exports = People;
