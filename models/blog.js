const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, minLength: 3, maxLength: 50 },
  content: { type: String, minLength: 50 },
  drafted_on: Date,
  published_on: Date,
  state: { type: String, enum: ['published', 'draft'] },
  type: { type: String, enum: ['coding', 'growth'], default: 'growth' },
  scheduled_to_be_published_on: Date,
  last_saved: Date,
  stats: {
    views: { type: Number, default: 0 },
    reads: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  }
});

BlogSchema.virtual('url').get(function() {
  return `/blog/${this._id}`;
});

module.exports = mongoose.model('Blog', BlogSchema);