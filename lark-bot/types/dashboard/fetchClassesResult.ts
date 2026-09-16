export type ClassItem = {
  class_soft_id: number | null
  class_name: string
  created_at: Date
}

export type FetchSuccess = ClassItem[]

export type FetchFailure = string;