/**
 * Created by joergwasmeier on 26.12.15.
 *
 *
 */
import FabaCore, {IFabaMediatorList} from "./FabaCore";
import FabaEvent from "./FabaEvent";
import FabaValueObject from "./FabaValueObject";
import {Application} from "express/lib/application";
import FabaStore from "./FabaStore";

export default class FabaNodeRuntime extends FabaCore {
    app: Application;

    express = require('express');
    assign = require('object.assign').getPolyfill();

    constructor(data:FabaStore<any>) {
        super(data);
        console.log('\x1Bc');

        this.app = this.express();
        this.startServer();
    }

    parseObject(obj) {
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
            let body = JSON.parse(req.rawBody);

            let targetEvent: FabaEvent;
            if (!FabaCore.events[body.identifyer]) {
                targetEvent = new FabaEvent(body.identifyer);
            } else {
                targetEvent = FabaCore.events[body.identifyer];
            }

            let h: any = this.assign(targetEvent, JSON.parse(req.rawBody));
            h = this.parseObject(h);
            h.dispatch().then((event) => {
                try {
                    res.send(JSON.stringify(event));
                } catch(e){
                    console.error(e);
                }

            });
        });

        var port = 3120;
        this.app.listen(port);
    }

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

    private rawData(req, res, next) {
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