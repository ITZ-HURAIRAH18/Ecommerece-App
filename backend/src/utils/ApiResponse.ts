export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

export class ApiResponse {
  statusCode: number
  success: boolean
  message: string
  data: any
  pagination?: PaginationMeta

  constructor(
    statusCode: number,
    message: string,
    data?: any,
    pagination?: PaginationMeta
  ) {
    this.statusCode = statusCode
    this.success = statusCode < 400
    this.message = message
    this.data = data ?? null
    this.pagination = pagination
  }
}
