import FabaCoreMediator from "@fabalous/core/FabaCoreMediator";
export class FabaNodeMediator extends FabaCoreMediator{

    addCommand(event:any, command:any, check?): void {
        if (check && !check()) return;

        super.addCommand(event, command);
    }
}