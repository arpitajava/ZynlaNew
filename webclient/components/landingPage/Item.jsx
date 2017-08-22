import React, { PropTypes } from 'react';
import {Grid} from 'semantic-ui-react';
import DisplayHomePageCardStructure from './displayHomePageCardStructure.jsx';

const propTypes = {
  isDragging: PropTypes.bool.isRequired,
  items: PropTypes.object.isRequired
};

export function Item(props) {
  /*eslint-disable*/
  const { items, isDragging } = props;
  if(items.upVotes === undefined) {
    items.upVotes = 0;
  }
  if(items.answerCounts === undefined) {
    items.answerCounts = 0;
  }
  if(items.views === undefined) {
    items.views = 0;
  }
  /*eslint-enable*/
  return (
    <div>
      <Grid.Column>
        <DisplayHomePageCardStructure id={items.id} displayImage={items.displayImage}
        heading={items.heading} question={items.question} postedBy={items.postedBy}
        addedOn={items.addedOn} category={items.category} upVotes={parseInt(items.upVotes, 10)}
        downVotes={parseInt(items.downVotes, 10)}
         answerCounts={items.answerCounts} views={items.views}
         tag={items.tag}
        profileImage={items.profileImage}
        fullObj={items}
      />

    </Grid.Column>

    </div>
  );
}

Item.propTypes = propTypes;

export function createItem(item, isDragging) {
  return <Item items = {item} isDragging = {isDragging}/>;
}
