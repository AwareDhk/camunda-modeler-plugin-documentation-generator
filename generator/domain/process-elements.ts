export interface ProcessElement {
  readonly id?: string
  readonly order: number
  readonly name: string
  readonly description: string
  readonly executor?: string
  readonly type?: string
}
