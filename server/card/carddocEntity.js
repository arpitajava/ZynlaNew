const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
    createdBy: {
        type: String
    },
    content: {
        type: String
    },
    answeredOn: {
      type: String
    },
    image: {
      type: String
    }
  });
const model = mongoose.model('carddoc', schema);
module.exports = model;
