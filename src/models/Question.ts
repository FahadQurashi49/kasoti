import {Schema, model} from 'mongoose';


let QuestionSchema: Schema = new Schema({
    statement: {
        type: String,
        minlength: [2, 'Name must be of atleast 2 characters'],
        // add max length
        required: [true, 'Name feild is required']
    },
    questioner: {
        type: Schema.Types.ObjectId,
        ref: 'questioner',
    },
    answer: {
        type: Boolean,
        default: null
    },
    gamePlay: {
        type: Schema.Types.ObjectId,
        ref: 'game_play',
    }
});

export default model('question', QuestionSchema);