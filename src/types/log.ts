import { Pagination } from "./pagination";

export interface Log {
  id: number;
  user: string;
  type_log: string;
  field: string;
  log: string;
  date_timer: string;
}

export type LogsResponse = {
  data: Log[];
  pagination: Pagination;
}; 

export interface GetLogsParams {
  page: number;
  limit: number;
  search?: string;
  order?: string;
  sortBy?: string;
}