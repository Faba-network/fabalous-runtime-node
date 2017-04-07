import {Application} from "express/lib/application";
import FabaCore from "@fabalous/core/FabaCore";
import FabaValueObject from "@fabalous/core/FabaValueObject";
import FabaEvent from "@fabalous/core/FabaEvent";
import FabaStore from "@fabalous/core/store/FabaStore";


/**
 * Runtime class and startpoint for node Project's
 *
 * Extend this class with your own logic.
 *
 * Need an store (FabaStore) as argument
 */

export default class FabaRuntimeNode extends FabaCore {
    app: Application;

    express = require('express');
    assign = require('object.assign').getPolyfill();

    /**
     * Constructor expects an store and register the FabaNodeMediator
     * @param store FabaStore which is available for the commands
     */
    constructor(store:FabaStore<any>) {
        super(store);
        console.log('\x1Bc');

        require('source-map-support').install();

        this.app = this.express();
        this.startServer();
    }

    /**
     * TODO: Reafactor or delete this?
     *
     * Parse objects and map it to value objects
     * @param obj
     * @returns {any}
     */
    parseObject(obj:any) {
        for (var key in obj) {
            if (obj[key] != null && obj[key].className != null) {
                let vo: FabaValueObject = obj[key];
                try {
                    let neVoInst: any = new FabaCore.vos[vo.className];
                    obj[key] = this.assign(neVoInst, vo);
                    obj[key] = this.parseObject(obj[key]);

                } catch (e) {
                    throw e;
                }
            }
        }
        return obj;
    }

    /**
     * Start the Webserver to handle all HTTP requests
     */
    private startServer() {
        this.app.use(function (req: any, res, next) {
            var data = "";
            req.on('data', function (chunk) {
                data += chunk
            });
            req.on('end', function () {
                req.rawBody = data;
                next();
            })
        });

        this.app.all('/', function (req: any, res: any, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            next();
        });

        this.app.get('/test', function (req: any, res: any) {
            res.send("Hallo welt");
        });

        this.app.post('/', (req: any, res: any) => {
            const body = JSON.parse(req.rawBody);

            let targetEvent: FabaEvent;
            if (!FabaCore.events[body.identifyer]) {
                targetEvent = new FabaEvent(body.identifyer);
            } else {
                targetEvent = new FabaCore.events[body.identifyer].event;
            }

            this.parseObject(this.assign(targetEvent, body)).dispatch().then((event) => {
                try {
                    res.send(JSON.stringify(event));
                } catch(e){
                    console.error(e);
                }
            });
        });

        let port = 3120;
        this.app.listen(port);
    }

    /**
     * Get the whole raw body of a request
     * @param req
     * @param res
     * @param next
     */
    private rawBody(req, res, next) {
        req.setEncoding('utf8');
        req.rawBody = '';
        req.on('data', function (chunk) {
            req.rawBody += chunk;
        });
        req.on('end', function () {
            next();
        });
    }
}