var mongoose = require('mongoose');



//defining Schema of users
var periodSchema = new mongoose.Schema({
    master_id: {
        type: Number,
        trim: true,
        require: true
    },
    org_id: {
        type: Number,
        trim: true,
        require: true
    },  
    shift_id: {
        type: Number,
        trim: true,
        require: true
    },
    stream_id: {
        type: Number,
        trim: true,
        require: true
    },
    department_id: {
        type: Number,
        trim: true,
        require: true
    },
    period_id: {
        type: Number,
        trim: true,
        require: true
    },
    atted_code: {
        type: Number,
        trim: true,
        require: true,
        unique: true
    }, 
    date: {
        type: String,
        default: null,
        trim: true,
        require: true,
    }, 
    active: {
        type: Boolean,
        default: true,
    },  
    std_list: [], 
});




//exporting user model
module.exports = mongoose.model('period', periodSchema);