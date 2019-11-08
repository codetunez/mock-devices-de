import * as http from 'http';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import root from './api/root';
import device from './api/device';
import devices from './api/devices';
import state from './api/state';
import sensors from './api/sensors';
import semanctics from './api/simulation';
import template from './api/template';

import { Config } from './config';
import { DeviceStore } from './store/deviceStore';
import { SensorStore } from './store/sensorStore';
import { SimulationStore } from './store/simulationStore';
import { ConsoleMessageService } from './core/consoleMessageService';

class Server {

    private expressServer: any = null;

    private deviceStore: DeviceStore;
    private sensorStore: SensorStore;
    private simulationStore: SimulationStore;

    public start = () => {

        const ms = new ConsoleMessageService(true, false);

        this.deviceStore = new DeviceStore(ms);
        this.sensorStore = new SensorStore();
        this.simulationStore = new SimulationStore();

        this.expressServer = express();
        this.expressServer.server = http.createServer(this.expressServer);
        if (Config.WEBAPI_LOGGING) { this.expressServer.use(morgan('tiny')); }
        this.expressServer.use(bodyParser.urlencoded({ extended: false }));
        this.expressServer.use(bodyParser.json({ limit: "9000kb" }));

        this.expressServer.use('/api/simulation', semanctics(this.deviceStore, this.simulationStore));
        this.expressServer.use('/api/device', device(this.deviceStore));
        this.expressServer.use('/api/devices', devices(this.deviceStore));
        this.expressServer.use('/api/state', state(this.deviceStore, this.simulationStore));
        this.expressServer.use('/api/sensors', sensors(this.sensorStore));
        this.expressServer.use('/api/template', template(this.deviceStore));
        this.expressServer.use('/api', root());

        this.expressServer.server.listen(Config.APP_PORT);
        console.log("mock-devices for docker started on: " + this.expressServer.server.address().port);
    }
}

new Server().start();