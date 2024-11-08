import { type ExtensionElementValue } from './extension-element-value'

export interface Outgoing {
  readonly $type: string
  readonly conditionExpression: ExtensionElementValue
  readonly value: string
  readonly text: string
}

export interface ErrorEventDefinition{
  readonly id:string
}

export interface MessageEventDefinition{
  
}


export interface EventDefinition{
  readonly $type: string
  readonly id:string
}

export interface EventDefinitionValue {
  readonly $type: string
 
}
