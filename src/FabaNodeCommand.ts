import FabaCoreCommand from "@fabalous/core/FabaCoreCommand";
import FabaEvent from "@fabalous/core/FabaEvent";


export class FabaNodeCommand<TStore> extends FabaCoreCommand<TStore>{
    emitToUser(event:FabaEvent, user?:any){
        event.callBack();
    }

    emitToGroup(){
        throw "Websocket implementation";
    }

    emitToAll(){
        throw "Websocket implementation";
    }

    execute(event:FabaEvent){
        throw "Execute is not implmented";
    }
}

export interface IFabaNodeCommand{
    execute(event:FabaEvent);
}