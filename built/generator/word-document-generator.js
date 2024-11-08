var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TemplateHandler } from 'easy-template-x';
// function getFlowElementExecutor(flowElement) {
//     let executor = '';
//     if (flowElement.$type === 'bpmn:UserTask' && flowElement.extensionElements !== undefined && flowElement.extensionElements.$type === 'bpmn:ExtensionElements') {
//         executor = flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:assignmentDefinition').map(extElem => extElem.assignee).join(',');
//     }
//     return executor;
// }
function getExtensionElementType(flowElement) {
    let executor = '';
    if (flowElement.$type === 'bpmn:serviceTask' && flowElement.extensionElements !== undefined && flowElement.extensionElements.$type === 'bpmn:extensionElements') {
        executor = flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:taskDefinition').map(extElem => extElem).join(',');
    }
    return executor;
}
export function generateWord(processDiagram, template) {
    return __awaiter(this, void 0, void 0, function* () {
        const processElements = processDiagram.flowElements.filter(flowElement => (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== undefined && (flowElement === null || flowElement === void 0 ? void 0 : flowElement.name) !== '').map((flowElement, index) => ({
            order: index + 1,
            name: flowElement.name,
            description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
            executor: getExtensionElementType(flowElement),
            type: getExtensionElementType(flowElement)
        }));
        // process the template
        const handler = new TemplateHandler();
        const data = {
            processName: (processDiagram.name !== undefined) ? processDiagram.name : '',
            processId: (processDiagram.id !== undefined) ? processDiagram.name : '',
            processIsExecutable: (processDiagram.isExecutable !== undefined) ? processDiagram.isExecutable : '',
            processDocumentation: processDiagram.documentation !== undefined && processDiagram.documentation.length === 1 ? processDiagram.documentation[0].text : '',
            activities: processElements
        };
        const doc = yield handler.process(Buffer.from(template), data);
        return doc;
    });
}
