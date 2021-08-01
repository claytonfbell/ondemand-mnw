export interface IStatusMonitorPing {
  name: string
  groupName: string
  tag: string
  details: string
  interval: number
  apiKey: string
  progressBar: number
  success: boolean
  emails: string[]
}
