import { RestError } from "./rest_error";
import { error } from "util";

// error codes does not have any special meaning
// they are just numbers starting from 100
export class KasotiErrorMsgMap {
    public static e100 = "player has already initiated other game";
    public static e101 = "gameplay could not be created";

    // for player changeType endPoint
    public static e102 = "not in a gameplay";
    public static e103 = "cannot change type while in a running game play";
    public static e104 = "unrecognized type";

    //for setNoOfQuestioner endPoint
    public static e105 = "a number is required";
    public static e106 = "cannot set noq while in a running game play";
    public static e107 = "game play not found";

}
export class KasotiErrorMap {
    public static e100 = new RestError(KasotiErrorMsgMap.e100, 100, 409);
    public static e101 = new RestError(KasotiErrorMsgMap.e101, 101, 409);
    // for player changeType endPoint
    public static e102 = new RestError(KasotiErrorMsgMap.e102, 102, 409);
    public static e103 = new RestError(KasotiErrorMsgMap.e103, 103, 409);
    public static e104 = new RestError(KasotiErrorMsgMap.e104, 104, 409);
    //for setNoOfQuestioner endPoint
    public static e105 = new RestError(KasotiErrorMsgMap.e105, 105, 400);
    public static e106 = new RestError(KasotiErrorMsgMap.e106, 106, 409);
    public static e107 = new RestError(KasotiErrorMsgMap.e107, 107, 400);
} 

export class KasotiError {
    public static throwError (errorCode: number) {
        let errorName = "e" + errorCode;
        throw KasotiErrorMap[errorName];
    }
}