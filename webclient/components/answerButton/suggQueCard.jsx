// written by Arun Mohan Raj
// importing require files
import React from 'react';
import { Card, Icon} from 'semantic-ui-react';
// suggested question card component
class SuggQueCard extends React.Component {
  constructor() {
    super();
    this.state = {
      buttonStatus: 'Add',
      checkmark: '',
      status: true
    };
  }
  // function to display checkmark in suggQuescard when user clicks it
  cardCheckmark() {
    if(this.state.status) {
        let checkmark = <Icon name='checkmark' color='green' size='large'/>;
        this.setState({checkmark: checkmark, status: false});
        this.props.suggQues(this.props.id);
        // console.log(this.props.qIdArr);
    } else {
      this.setState({checkmark: '', status: true});
      this.props.suggQues(this.props.id);
    }
  }
  render() {
      return(
        <div>
        <Card fluid onClick={this.cardCheckmark.bind(this)}>
            <Card.Content extra>
                <a>
                    posted by {this.props.name}
                </a>
                <p>
                      <div className='checkmarkbtn'>
                        {this.state.checkmark}
                      </div>
                </p>
            </Card.Content>
            <Card.Content>
                <Card.Header>
                    {this.props.title}
                </Card.Header>
                <Card.Description className='ansWidth'>
                    {this.props.content}
                </Card.Description>
            </Card.Content>
        </Card>
        <br />
      </div>
    );
  }
}
SuggQueCard.propTypes = {
  id: React.PropTypes.number,
  dp: React.PropTypes.string,
  name: React.PropTypes.string,
  time: React.PropTypes.number,
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  suggQues: React.PropTypes.func
  };
module.exports = SuggQueCard;
