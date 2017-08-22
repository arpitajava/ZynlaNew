import DisplayFavouriteCategory from './displayFavouriteCategory.jsx';
import DisplayHomePageCard from './displayHomePageCard';
import React from 'react';
import Cookie from 'react-cookie';
import {hashHistory} from 'react-router';
import $ from 'jquery';

class Cards extends React.Component {
    constructor() {
        super();
        this.state = {
            json: [],
            savedata: [],
            arra: [],
            followCard: []
        };
        this.displayAllCategory = this.displayAllCategory.bind(this);
    }

    componentDidMount() {
        this.displayFollowingCards();
        this.displayAllCategory();
    }
    /* Get the saved cards Id from neo4j*/
    displayFollowingCards() {
        let emailId = Cookie.load('email');
        let arr = [];
        $.ajax({
            url: `/users/getAllCards/${emailId}`,
            type: 'GET',
            success: function(data) {
              // console.log('----------------',data);
                data.map(function(item) {
                    arr.push(item);
                    // console.log(item.tag);
                });

                this.setState({savedata: arr});
                this.rankingCards();
            }.bind(this)
        });
    }
    // To display cards in the correct position(Drag and Drop)
    rankingCards1() {
        let temp = [];
        let aa = [];
        temp = this.state.savedata;
        for (let i = 0; i < temp.length; i = i + 1) {
            /*eslint-disable*/
            if (temp[i].position !== undefined) {
                /*eslint-enable*/
                let position = temp[i].position;
                aa[position] = temp[i];
                temp.splice(i + 2, 1);
            }
        }
        let k = 0;
        for (let j = 0; j < temp.length; j = j + 1) {
            /*eslint-disable*/
            if (aa[j] === undefined) {
                if(this.check(aa, temp[k]))
                  aa[j] = temp[k++];
                /*eslint-enable*/
                // console.log("jjjjjj:" + aa[j]);
            }
        }
        this.setState({savedata: aa});
    }

    rankingCards() {
      let arr = [];
      for(let temp of this.state.savedata) {
        if(temp.tag === 'You preferred') {
          arr[temp.position] = temp;
        }
      }
      for(let temp of this.state.savedata) {
        if(temp.tag !== 'You preferred') {
          /* eslint-disable */
          let temp2 = true;
          for(let k = 0; k < arr.length; k = k + 1) {
            if(arr[k] !== undefined) {
              continue;
            }
            else {
              if(this.checkforundefined(temp.heading)) {
                arr[k] = temp;
              }
              break;
              temp2 = false;
            }
          }
          if(temp2 && this.check(arr, temp)) {
            if(this.checkforundefined(temp.heading)) {
              arr.push(temp);
            }
          }
          /* eslint-enable */
        }
      }
      this.setState({
        savedata: arr
      });
    }

    checkforundefined(temp) {
      let check = true;
      if(temp) {
        check = true;
      }
      else {
        check = false;
      }
      return check;
    }

    check(arr, temp) {
      let checkTemp = true;
      if(arr && temp) {
        for(let x of arr) {
          if(x.id === temp.id) {
            // console.log('x:' + x.id + '\ttemp:' + temp.id);
            return false;
          }
        }
      }
      else {
        checkTemp = false;
      }
      return checkTemp;
    }
    // Display your all the category
    displayAllCategory() {
        // console.log("Inside...")
        $.ajax({
            url: '/list/getImages',
            type: 'GET',
            success: function(data) {
                this.setState({json: data});
            }.bind(this)
        });
    }

    render() {
        let homePage;
        /* eslint-disable*/
        if(Cookie.load('email')){
          if (Cookie.load('quesId') === undefined) {
              /* eslint-enable*/
              homePage = (
                  <div>
                    <div className='search3'>
                      <DisplayFavouriteCategory
                         json={this.state.json}/>
                       </div>
                       <div className='search2'>
                          {this.state.savedata.length > 0
                          ? <DisplayHomePageCard display={this.state.savedata}
                            follow={this.state.followCard}/>
                          : null}
                      </div>
                  </div>
              );
          } else {
              let qId = Cookie.load('quesId');
              Cookie.remove('quesId', {path: '/'});
              // console.log(Cookie.load('quesId'))
              hashHistory.push('/answerPage?id=' + qId);
          }
        }
        else {
          hashHistory.push('/');
        }
        return (
            <div>{homePage}</div>
        );
    }
}

module.exports = Cards;
