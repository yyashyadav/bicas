const mongoose = require('mongoose');

const surveillanceSchema = mongoose.Schema(
  {
    fileHash: {
      type: String,
      required: true,
      unique: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Surveillance', surveillanceSchema); 