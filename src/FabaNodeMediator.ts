import FabaCoreMediator from "@fabalous/core/FabaCoreMediator";
import FabaEvent from "@fabalous/core/FabaEvent";
import {FabaNodeCommand} from "./FabaNodeCommand";
export class FabaNodeMediator extends FabaCoreMediator{

    addCommand(event:any, command:any, check?): void {
        if (check && !check()) return;

        super.addCommand(event, command);
    }
}