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
        min: [1, "atleast one questioner required"], 
        max: [4, "maximum 4 questioner allowed"] 
    },
    isWaiting: {
        type: Boolean,
        default: false
    },
    isRunning: {
        type: Boolean,
        default: false
    }
    // add invite url
});

export default model('game_play', GamePlaySchema);