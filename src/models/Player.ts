import {Schema, model} from 'mongoose';


let options = {discriminatorKey: 'kind'};
let PlayerSchema: Schema = new Schema({
    name: {
        type: String,
        minlength: [2, 'Name must be of atleast 2 characters'],
        maxlength: [30, 'Name must be of atmost 30 characters'],
        required: [true, 'Name feild is required']
    },
    gamePlay: {
        type: Schema.Types.ObjectId,
        ref: 'game_play',
    }
}, options);

export default model('player', PlayerSchema);