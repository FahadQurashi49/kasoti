import { KasotiErrorMap } from "./kasoti_error_map";

export class RestError {
    public constructor (public message: string, public errorCode: number, public statusCode: number) {
        
    }
}