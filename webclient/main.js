var React = require('react');
var ReactDOM = require('react-dom');
var {browserHistory, Route, Router, IndexRoute} = require('react-router');
var GmailBox = require('./components/GmailBox');
var NavBar = require('./components/NavBar');
var About = require('./components/About');
var Home = require('./components/Home');

var MainComp = React.createClass({
  render:function(){
    return(
      <div>
      <NavBar/>
      <br/><br/><br/><br/>
        {this.props.children}
      </div>    );
  }
})
ReactDOM.render(
  <Router history={browserHistory}>
                <Route path="/" component={MainComp}/>   
                <Route path="/home" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/gmailbox" component={GmailBox}/>

  </Router>,document.getElementById('mountapp'));
