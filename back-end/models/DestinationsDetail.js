// back-end/models/DestinationDetail.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationDetailSchema = new Schema({
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    description: String,
    bestSeason: String,
    climate: String,
    tips: [String],
    images: [String],
    activities: [String]
});

module.exports = mongoose.model('DestinationDetail', DestinationDetailSchema);