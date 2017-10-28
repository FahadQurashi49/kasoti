import { Schema, model } from 'mongoose';
import Player from '../models/Player';

let options = { discriminatorKey: 'kind' };
export const AnswererSchema: Schema = new Schema({
    Answer: {
        type: String,
        minlength: [2, 'Answer must contain atleast 2 characters'],
        // add max length
        required: [true, "Answer is required"]
    }
});


export default Player.discriminator('answerer', AnswererSchema, options);
