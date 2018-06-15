import {Injectable} from '@angular/core';

@Injectable()
export class ErrParserService {

    toArr(errorResponse : any) {
        const obj = errorResponse;
        if ('message' in obj) {
            let msg = obj['message'];

            for (let i = 0; i < msg.length; i++) {
                if (msg[msg.length - 1] == "\n") {
                    msg = msg.substring(0, msg.length - 1);
                } else {
                    break;
                }
            }

            if (msg.includes("\n")) {
                console.log(msg.split("\n"));
                return msg.split("\n");
            }

            return [msg];
        } else {
            return [obj.toString()];
        }
    }
}