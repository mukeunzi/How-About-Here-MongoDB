const mongoose = require('mongoose');

const { Schema } = mongoose;
const {
	Types: { ObjectId }
} = Schema;

const tagSchema = new Schema(
	{
		tag_name: {
			type: String,
			required: true
		},
		create_id: {
			type: ObjectId,
			required: true,
			ref: 'User'
		},
		update_id: {
			type: ObjectId,
			required: true,
			ref: 'User'
		},
		status_code: {
			type: Number,
			required: true,
			default: 1
		}
	},
	{ timestamps: { createdAt: 'create_date', updatedAt: 'update_date' } }
);

tagSchema.statics.createTag = async function(authorObjectId, tagName) {
	const newTag = await this.create({
		tag_name: tagName,
		create_id: authorObjectId,
		update_id: authorObjectId
	});

	return newTag;
};

module.exports = mongoose.model('Tag', tagSchema);
