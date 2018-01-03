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

    // for joinGame end point 
    public static e108 = "no room for new questioner";
    public static e109 = "no room for new answerer";
    public static e110 = "player type not identified";
    public static e111 = "gameplay not waiting";
    public static e112 = "gameplay already running";
    public static e113 = "gameplay not found";
    public static e114 = "player already in a gameplay";
    public static e115 = "player not found";    
    public static e116 = "no. of questioner not set";

    // for startGame end point
    public static e117 = "game conditions do no matched";
    public static e118 = "gameplay already running";
    public static e119 = "gameplay not waiting";
    public static e120 = "gameplay not found";
    public static e121 = "no. of questioner not set";
    

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
    // for joinGame end point
    public static e108 = new RestError(KasotiErrorMsgMap.e108, 108, 409);
    public static e109 = new RestError(KasotiErrorMsgMap.e109, 109, 409);
    public static e110 = new RestError(KasotiErrorMsgMap.e110, 110, 400);
    public static e111 = new RestError(KasotiErrorMsgMap.e111, 111, 409);
    public static e112 = new RestError(KasotiErrorMsgMap.e112, 112, 409);
    public static e113 = new RestError(KasotiErrorMsgMap.e113, 113, 409);
    public static e114 = new RestError(KasotiErrorMsgMap.e114, 114, 409);
    public static e115 = new RestError(KasotiErrorMsgMap.e115, 115, 409);
    public static e116 = new RestError(KasotiErrorMsgMap.e116, 116, 409);
    // for startGame end point
    public static e117 = new RestError(KasotiErrorMsgMap.e117, 117, 409);
    public static e118 = new RestError(KasotiErrorMsgMap.e118, 118, 409);
    public static e119 = new RestError(KasotiErrorMsgMap.e119, 119, 409);
    public static e120 = new RestError(KasotiErrorMsgMap.e120, 120, 409);
    public static e121 = new RestError(KasotiErrorMsgMap.e121, 121, 409);

} 

export class KasotiError {
    public static throwError (errorCode: number) {
        let errorName = "e" + errorCode;
        throw KasotiErrorMap[errorName];
    }
}