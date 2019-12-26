'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
	postId: {
		type: ObjectId,
		ref: 'Post',
		required: true
	},
	userId: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	text: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	status: Boolean
},
	{
		timestamps: true
	}
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
