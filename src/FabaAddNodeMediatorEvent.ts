import FabaEvent from "@fabalous/core/FabaEvent";
import FabaCoreMediator from "@fabalous/core/FabaCoreMediator";
import {FabaNodeMediator} from "./FabaNodeMediator";

export default class FabaAddNodeMediatorEvent extends FabaEvent {

    mediator:FabaNodeMediator;

    constructor(mediator:FabaNodeMediator) {
        super("FabaAddNodeMediatorEvent");
        this.mediator = mediator;
    }
}