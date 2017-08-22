import React from 'react';
import MainQuestionCard from './mainQuestionCard.jsx';
class questionsCard extends React.Component {
    constructor () {
        super();
    }
    // static defaultProps = {}


    render () {
        let arr = this.props.questionData.map(function(item, index) {
                return (
            <div key = {index}>

                <MainQuestionCard heading={item.heading} category={item.category}
                statement={item.statement} image={item.image} addedOn={item.addedOn}
                upVote={item.upVote} acceptedCount={item.acceptedCount}
                downvote={item.downVote} postedBy={item.postedBy}/>
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

module.exports = questionsCard;
questionsCard.propTypes = {
  questionData: React.PropTypes.array
};
