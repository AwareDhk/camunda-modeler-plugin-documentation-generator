import { type ExtensionElementValue } from './extension-element-value'

export interface Incoming {
  readonly $type: string
  readonly conditionExpression: ExtensionElementValue
  readonly value: string
  readonly text: string
}
