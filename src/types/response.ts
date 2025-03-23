import { Pagination } from "@/types/pagination";

export interface BaseResponse<T> {
    success: boolean;
    data: T;
    message: string;
    meta: {
        statusCode: number;
        timestamp: string;
    }
}

export interface PaginatedResponse<T> extends BaseResponse<T> {
    meta: {
        statusCode: number;
        timestamp: string;
        pagination: Pagination;
    }
}

export interface ErrorResponse extends Omit<BaseResponse<null>, 'data'> {
    error: string
    meta: {
        statusCode: number;
        timestamp: string;
        path: string;
    }
}
