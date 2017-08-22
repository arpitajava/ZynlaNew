import React from 'react';
import MainAnswerCard from './mainAnswerCard.jsx';
class answersCard extends React.Component {
    constructor () {
        super();
    }
    // static defaultProps = {}


    render () {
        let arr = this.props.answerData.map(function(item, index) {
                return (
            <div key ={index}>
                <MainAnswerCard answer={item.statement} addedOn={item.addedOn}
                image={item.image} upVote={item.upVote} downVote={item.downVote}
                />
            </div>
            );
        });
        return(
          <div>
            {arr}
          </div>
        );
      }
}
answersCard.propTypes = {
  answerData: React.PropTypes.array
};

module.exports = answersCard;
