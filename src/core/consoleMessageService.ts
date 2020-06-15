import { Config } from '../config';
import * as WebSocket from 'ws';
import { MessageService } from '../interfaces/messageService';

export class ConsoleMessageService implements MessageService {

    private propertyUpdatePayload = {};
    private showConsole: boolean;
    private showLiveUpdate: boolean;
    private timer: any = null;

    constructor() {
        this.liveUpdateTimer();
    }

    end() {
        this.timer = null;
    }

    sendConsoleUpdate(message: string) {
        if (Config.CONSOLE_LOGGING) { console.log(message); }
    }

    sendAsLiveUpdate(payload: any) {
        Object.assign(this.propertyUpdatePayload, payload);
    }

    liveUpdateTimer = () => {
        if (Config.PROPERTY_LOGGING) {
            this.timer = setInterval(() => {
                console.log(JSON.stringify(this.propertyUpdatePayload));
            }, 750)
        }
    }
}