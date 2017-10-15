import FabaCoreMediator from "@fabalous/core/FabaCoreMediator";
import FabaStore from "@fabalous/core/store/FabaStore";
import FabaImmutableStore from "@fabalous/core/store/FabaImmutableStore";
import FabaEvent from "@fabalous/core/FabaEvent";
export class FabaNodeMediator extends FabaCoreMediator{

    addCommand(event:any, command:any, check?:(store: FabaStore<any> | FabaImmutableStore<any>, event:FabaEvent) => boolean): void {
        super.addCommand(event, command, check);
    }
}