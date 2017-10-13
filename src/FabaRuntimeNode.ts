import {Application} from "express/lib/application";
import FabaCore from "@fabalous/core/FabaCore";
import FabaValueObject from "@fabalous/core/FabaValueObject";
import FabaEvent from "@fabalous/core/FabaEvent";
import FabaStore from "@fabalous/core/store/FabaStore";
import {ServerResponse} from "http";
var session = require('express-session');
var helmet = require('helmet');

/**
 * Runtime class and startpoint for node Project's
 *
 * Extend this class with your own logic.
 *
 * Need an store (FabaStore) as argument
 */

export default class FabaRuntimeNode extends FabaCore {
    app: any;

    express = require('express');

    /**
     * Constructor expects an store and register the FabaNodeMediator
     * @param store FabaStore which is available for the commands
     */
    constructor(store:FabaStore<any>, port:number, sessionSecret:string) {
        super(store);
        //console.log('\x1Bc');

        require('source-map-support').install();

        this.app = this.express();
        this.app.use(helmet({}));
        this.app.use(session({
            secret: sessionSecret,
            cookie: { maxAge: 60000, httpOnly: true }
        }));

        this.startServer(port);
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
                    obj[key] = Object.assign(neVoInst, vo);
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
    private startServer(port = 3120) {
        this.app.use(function (req: any, res, next) {
            let data = "";
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
            if (req.session.views) {
                req.session.views++
            } else {
                req.session.views = 1
            }
            console.log(req.session);
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

            body.sessionData = req.session;

            this.parseObject(Object.assign(targetEvent, body)).dispatch().then((event) => {
                try {
                    event.sessionData = null;
                    delete event.sessionData;
                    res.send(JSON.stringify(event));
                } catch(e){
                    console.error(e);
                }
            });
        });

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