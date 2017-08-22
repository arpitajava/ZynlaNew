import React from 'react';
import Answercard from './answerCardStructure.jsx';

class Cards extends React.Component {
	constructor () {
		super();
	}
	// static defaultProps = {}

// Getting top card answers from mongo db created by Aswini K
	render () {
		let arr = this.props.ansCollection;
		let cards = arr[0].topCards.map(function(item) {
				return (
			<div>
				<Answercard quesId={arr[0].id} createdBy={item.createdBy} content={item.content}
				createdOn={item.createdOn} id={item.id} upvote={item.upVote}
				downvote={item.downVote} isAccepted={item.isAccepted} postedBy={arr[0].postedBy}/>
			</div>
			);
		});

		return(
			<div>
			{cards}
		</div>
		);
	}
}
Cards.propTypes = {
	ansCollection: React.PropTypes.array.isRequired
};
module.exports = Cards;
