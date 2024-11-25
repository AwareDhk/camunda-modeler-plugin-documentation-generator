import { type ProcessElement } from './domain/process-elements'
import { type ProcessDiagram } from './domain/process-diagram'
import { type ProcessFlowElement } from './domain/process-flow-element'
import { type TemplateData, TemplateHandler } from 'easy-template-x'

function getFlowElementExecutor (flowElement: ProcessFlowElement): string {
  let executor = '';
  if (flowElement.$type === 'bpmn:UserTask' && flowElement.extensionElements !== undefined && flowElement.extensionElements.$type === 'bpmn:ExtensionElements') {
    executor = flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:assignmentDefinition').map(extElem => extElem.assignee).join(',')
  }

  return executor
}

function getExtensionElementType (flowElement: ProcessFlowElement): string {
  let executor = '';
    if (flowElement.$type === 'bpmn:ServiceTask') {
      executor += flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:taskDefinition').map(extElem => extElem.type ).join(',');
    }
   return executor
}

function getCallActivity (flowElement: ProcessFlowElement): string {
  let executor = '';
    if (flowElement.$type === 'bpmn:CallActivity') {
      executor += flowElement.extensionElements.values.filter(extElem => extElem.$type === 'zeebe:calledElement').map(extElem => extElem.processId ).join(',');
    }
   return executor
}

function getBoundary (flowElement: ProcessFlowElement): string {
  let executor = '';
    if (flowElement.$type === 'bpmn:BoundaryEvent') {


      executor += flowElement.eventDefinitions.filter(extElem => extElem.$type === 'bpmn:ErrorEventDefinition').map(extElem => extElem.id ).join(',');
      executor += flowElement.eventDefinitions.filter(extElem => extElem.$type === 'bpmn:MessageEventDefinition').map(extElem => extElem.id ).join(',');

    }
   return executor
}

function getGateway (flowElement: ProcessFlowElement): string {
  let executor = '';
    if (flowElement.$type === 'bpmn:ExclusiveGateway'|| flowElement.$type === 'bpmn:ParallelGateway') {

      if(flowElement.incoming?.length > 0)
      {
        executor += "Incoming: \n "
        flowElement.incoming.forEach(function (_value, i) {

           executor += (i + 1) + ": " + (flowElement.incoming[i] as unknown as ProcessFlowElement).id + " \n "

           if(flowElement.incoming[i].conditionExpression !== undefined && flowElement.outgoing[i].conditionExpression !== null)
            executor +=  " \n " + flowElement.incoming[i]?.conditionExpression.body + " \n \n"
          else{
              executor += " condition: none" + " \n "
          }

        });
      }

      if(flowElement.outgoing?.length > 0)
        {
          executor += "Decisions : \n"
          flowElement.outgoing.forEach(function (_value, i) {

             executor += (i + 1) + ": " + (flowElement.outgoing[i] as unknown as ProcessFlowElement).id + " \n "

            if(flowElement.outgoing[i].conditionExpression !== undefined && flowElement.outgoing[i].conditionExpression !== null)
              executor += "condition" + flowElement.outgoing[i]?.conditionExpression.body + " \n \n"
            else
                executor += "condition: none (default flow)" + " \n "

          });
        }

   }
   return executor
}

export async function generateWord (processDiagram: ProcessDiagram, template: Buffer): Promise<Buffer> {
  const processElements: ProcessElement[] = processDiagram.flowElements.filter(flowElement => flowElement?.name !== undefined && flowElement?.name !== '').map((flowElement, index) => ({
    order: index + 1,
    id: flowElement.id,
    name: flowElement.name,
    description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
    executor: getFlowElementExecutor(flowElement),
    type: getExtensionElementType(flowElement),
    call: getCallActivity(flowElement),
  }))

  const CallActivites: ProcessElement[] = processDiagram.flowElements.filter(flowElement => flowElement?.name !== undefined && flowElement?.name !== '' && getCallActivity(flowElement) !== '').map((flowElement, index) => ({
    order: index + 1,
    id: flowElement.id,
    name: flowElement.name,
    description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
    executor: getFlowElementExecutor(flowElement),
    type: getExtensionElementType(flowElement),
    call: getCallActivity(flowElement)
  }))

  var  confluenceLink = "https://hyperautomation.atlassian.net/wiki/spaces/Camunda/pages/";
  var  confluencePage = "2105737217/BAW+Badge+answers";
  const JobWorkers: ProcessElement[] = processDiagram.flowElements.filter(flowElement => flowElement?.name !== undefined && flowElement?.name !== '' && getExtensionElementType(flowElement) !== '').map((flowElement, index) => ({
    order: index + 1,
    id: flowElement.id,
    "workerName": {
           _type: 'link',
           text: flowElement.name,  // Optional - if not specified the `target` property will be used
           target: 'https://hyperautomation.atlassian.net/wiki/spaces/Camunda/pages/' + confluencePage
     },
     name: confluenceLink,
     description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
    executor: getFlowElementExecutor(flowElement),
    type: getExtensionElementType(flowElement),
    call: getCallActivity(flowElement)
  }))

  const GateWays: ProcessElement[] = processDiagram.flowElements.filter(flowElement => flowElement?.name !== undefined && flowElement?.name !== '' && getGateway(flowElement) !== '').map((flowElement, index) => ({
    order: index + 1,
    id: flowElement.id,
    name: flowElement.name,
    description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
    incoming: getGateway(flowElement)
  }))

  const Lanes: ProcessElement[] = processDiagram.laneSet?.lane?.filter(flowElement => flowElement?.name !== undefined && flowElement?.name !== '').map((flowElement, index) => ({
    order: index + 1,
    id: flowElement.id,
    name: flowElement.name,
    description: ""
  }))

  const Boundaries: ProcessElement[] = processDiagram.flowElements.filter(flowElement => getBoundary(flowElement) !== '').map((flowElement, index) => ({
    order: index + 1,
    id: flowElement.id,
    name: flowElement.name,
    description: (flowElement.documentation !== undefined && flowElement.documentation.length > 0) ? flowElement.documentation[0].text : '',
    boundary: getBoundary(flowElement)
  }))

  // process the template
  const handler = new TemplateHandler()
  const data = {
    processName: (processDiagram.name !== undefined) ? processDiagram.name : '',
    processId: (processDiagram.id !== undefined) ? processDiagram.name : '',
    processIsExecutable: (processDiagram.isExecutable !== undefined) ? processDiagram.isExecutable : '',
    processDocumentation: processDiagram.documentation !== undefined && processDiagram.documentation.length === 1 ? processDiagram.documentation[0].text : '',
    activities: processElements as unknown as TemplateData[],
    callActivities: CallActivites as unknown as TemplateData[],
    jobWorkers: JobWorkers as unknown as TemplateData[],
    gateWays: GateWays as unknown as TemplateData[],
    lanes : Lanes as unknown as TemplateData[],
    boundaries: Boundaries as unknown as TemplateData[]
  }

  const doc = await handler.process(Buffer.from(template), data)

  return doc
}
