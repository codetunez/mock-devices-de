const isDocker = require('is-docker');
import { Router } from 'express';
import * as uuidV4 from 'uuid/v4';
import * as fs from 'fs';
import { REPORTING_MODES } from '../config';

export default function (globalContext) {
    let api = Router();

    api.get('/ping', function (req, res) {
        res.status(200);
    });

    api.get('/ui', function (req, res) {
        res.json({
            container: isDocker(),
            edge: {
                deviceId: globalContext.IOTEDGE_DEVICEID,
                moduleId: globalContext.IOTEDGE_MODULEID
            }
        });
    });

    api.get('/id', function (req, res) {
        res.status(200).send(uuidV4()).end();
    });

    api.post('/setmode/:mode', function (req, res) {
        const mode = req.params.mode;
        switch (mode) {
            case "ux":
                globalContext.OPERATION_MODE = REPORTING_MODES.UX;
                break;
            case "server":
                globalContext.OPERATION_MODE = REPORTING_MODES.SERVER;
                break;
            case "mixed":
                globalContext.OPERATION_MODE = REPORTING_MODES.MIXED;
                break;
            default:
                globalContext.OPERATION_MODE = REPORTING_MODES.UX;
        }
        res.status(200).send(globalContext.OPERATION_MODE.toString()).end();
    });

    return api;
}