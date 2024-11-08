var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-expect-error import
import BpmnModdle from 'bpmn-moddle';
const moddle = new BpmnModdle();
export const buildJsonFromBpmnXml = (bpmnFile) => __awaiter(void 0, void 0, void 0, function* () {
    const bpmnJson = yield moddle.fromXML(bpmnFile.bpmnXml);
    return getAllProcessDefinitions(bpmnJson.rootElement);
});
function getAllProcessDefinitions(processDefinition) {
    return processDefinition.rootElements.filter((rootElement) => rootElement.$type === 'bpmn:Process');
}
