import {Schema, model} from 'mongoose';


let GamePlaySchema: Schema = new Schema({
    name: {
        type: String
    },
    initiator: {
        type: Schema.Types.ObjectId,
        ref: 'player',
        required: [true, 'initiator is required']
    },
    noOfQuestioner: {
        type: Number,
        required: [true, "number of questioner is required"],
        default: 0
    }
    // add invite url
});

export default model('game_play', GamePlaySchema);