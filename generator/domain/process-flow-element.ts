import { type DocumentationElement } from './documentation-element'
import { type ExtensionElement } from './extension-element'
import { type Incoming } from './incomming-element'
import { type Outgoing, EventDefinition } from './outgoing-element'

export interface ProcessFlowElement {
  readonly id: string
  readonly $type: string
  readonly name: string
  readonly documentation: DocumentationElement[]
  readonly extensionElements: ExtensionElement
  readonly incoming: Incoming[]
  readonly outgoing: Outgoing[]
  readonly eventDefinitions: [EventDefinition];
  readonly body:string

}
