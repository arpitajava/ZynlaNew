import React from 'react';
// let {browserHistory, Route, Router, IndexRoute} = require('react-router');
class PageNotFound extends React.Component {
  render() {
    return(
      <div>
        <img className='foferror' src='http://media02.hongkiat.com/error_404_01/csstricks.jpg' />
      </div>
    );
  }
}

module.exports = {
  PageNotFound
};
