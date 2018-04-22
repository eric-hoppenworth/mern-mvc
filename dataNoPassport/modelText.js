module.exports =
`const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
	name: String,
    age: Number,
    isTall: Boolean
});

module.exports = mongoose.model('Person', personSchema);`;
