import { RestError } from "./rest_error";
import { error } from "util";

export class KasotiErrorMsgMap {
    public static e100 = "player has already initiated other game";
    public static e101 = "gameplay could not be created";
}
export class KasotiErrorMap {
    public static e100 = new RestError(KasotiErrorMsgMap.e100, 100, 409);
    public static e101 = new RestError(KasotiErrorMsgMap.e101, 101, 409);    
} 

export class KasotiError {
    public static throwError (errorCode: number) {
        let errorName = "e" + errorCode;
        throw KasotiErrorMap[errorName];
    }
}