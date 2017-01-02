"use strict";
var FabaNodeMediator_1 = require("../src/FabaNodeMediator");
var FabaNodeCommand_1 = require("../src/FabaNodeCommand");
var FabaEvent_1 = require("@fabalous/core/FabaEvent");
describe("Server should start", function () {
    it("Add Mediator", function () {
    });
});
var TestCommand = (function (_super) {
    __extends(TestCommand, _super);
    function TestCommand() {
        return _super.apply(this, arguments) || this;
    }
    TestCommand.prototype.execute = function (event) {
        console.log("Execute");
    };
    return TestCommand;
}(FabaNodeCommand_1.FabaNodeCommand));
var TestEvent = (function (_super) {
    __extends(TestEvent, _super);
    function TestEvent() {
        return _super.call(this, "TestEvent") || this;
    }
    return TestEvent;
}(FabaEvent_1.default));
var TestMediator = (function (_super) {
    __extends(TestMediator, _super);
    function TestMediator() {
        return _super.apply(this, arguments) || this;
    }
    TestMediator.prototype.registerCommands = function () {
        this.addCommand(TestEvent, TestCommand);
    };
    return TestMediator;
}(FabaNodeMediator_1.FabaNodeMediator));
//# sourceMappingURL=NodeRuntimeSpec.js.map