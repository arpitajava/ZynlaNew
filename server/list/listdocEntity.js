const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    tags: {
        type: String
    },
    heading: {
        type: String
    },
    question: {
        type: String
    },
    image: {
        type: String
    },
    displayImage: {
        type: String
    },
    profileImage: {
        type: String
    },
    addedOn: {
        type: String
    },
    upVotes: {
        type: String
    },
    downVotes: {
        type: String
    },
    answerCounts: {
        type: Number
    },
    postedBy: {
        type: String
    },
    status: {
        open: Boolean,
        close: {
            closedBY: {
                type: String
            },
            closedOn: {
                type: String
            },
            reason: {
                type: String
            }
        }
    },
    comment: [
       {
         id: Number,
         createdBy: String,
         content: String,
         createdOn: String
       }
   ],
    topCards: [
        {
            id: Number,
            createdBy: String,
            content: String,
            createdOn: String,
            image: String,
            upVote: Number,
            downVote: Number,
            isAccepted: Boolean
        }
    ],
    views: {
        type: Number
    }
});
const list = mongoose.model('listdoc', schema);
module.exports = list;
