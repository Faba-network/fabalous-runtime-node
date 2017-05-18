import FabaCoreMediator from "@fabalous/core/FabaCoreMediator";
import FabaEvent from "@fabalous/core/FabaEvent";
import {FabaNodeCommand} from "./FabaNodeCommand";
export class FabaNodeMediator extends FabaCoreMediator{

    addCommand(event:any, command: typeof FabaNodeCommand): void {
        super.addCommand(event, command);
    }
}