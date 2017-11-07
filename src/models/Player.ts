import {Schema, model} from 'mongoose';
import PlayerType from './PlayerType';


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
    },
    playerType: {
        type: String,
        enum: Object.keys(PlayerType).map(key => PlayerType[key]),
        required: true,
        default: 'Player'
    },
    noOfQuestions: {
        type: Number,
        required: [() => {
            return this.playerType === PlayerType.QUESTIONER
        }, "no of questions is required"]
    },
    Answer: {
        type: String,
        minlength: [2, 'Answer must contain atleast 2 characters'],
        // add max length
        required: [() => {
            return this.playerType === PlayerType.ANSWERER
        }, "Answer is required"]
    }

});

export default model('player', PlayerSchema);