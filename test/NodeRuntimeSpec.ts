import {FabaNodeMediator} from "../src/FabaNodeMediator";
import {FabaNodeCommand, IFabaNodeCommand} from "../src/FabaNodeCommand";
import FabaEvent from "@fabalous/core/FabaEvent";

describe("Server should start", ()=>{
    it("Add Mediator", ()=>{

    });
});

class TestCommand extends FabaNodeCommand<{}> implements IFabaNodeCommand{
    execute(event:FabaEvent){
        console.log("Execute");
    }
}

class TestEvent extends FabaEvent{
    constructor(){
        super("TestEvent");
    }
}

class TestMediator extends FabaNodeMediator{
    registerCommands(){
        this.addCommand(TestEvent, TestCommand);
    }
}