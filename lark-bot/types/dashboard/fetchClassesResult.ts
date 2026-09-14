export type FetchSuccess = {
  class_soft_id: number | null
  class_name: string
  created_at: Date
}[]

export type FetchFailure = string;