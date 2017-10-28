import {Schema, model} from 'mongoose';
import Player from  '../models/Player';
 
let options = {discriminatorKey: 'kind'};
export const QuestionerSchema: Schema = new Schema({
    noOfQuestions: {
        type: Number,
        required: [true, "no of questions is required"],
        default: 0
    }
});

export default Player.discriminator('questioner', QuestionerSchema, options);
