var mongoose= require('mongoose');

var pollSchema = mongoose.Schema({
                                     name:          String,
                                     choices:       [String],
                                     email:         String
                                 });


// create the model for users and expose it to our app
module.exports = mongoose.model('Poll', pollSchema);