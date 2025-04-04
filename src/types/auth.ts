import { BaseResponse, PaginatedResponse } from "./response";

export interface SignInPayload {
    username: string;
    password: string;
}

interface SignInResult {
    user: {
        username: string;
        sub: string;
        email: string;
        allowedPages: string[];
    }
}

interface UserResult {
    user: {
        userId: string;
        username: string;
        email: string;
        allowedPages: string[];
    }
}

export interface User {
    id: string;
    username: string;
    codigo: string;
    email: string;
    allowedPages: string[];
}

export interface UserPermissions {
    username: string;
    allowedPages: string[];
}

export type SignInResponse = BaseResponse<SignInResult>;
export type UserResponse = BaseResponse<UserResult>;
export type RefreshTokenResponse = BaseResponse<null>;

export enum UserSortField {
    ID = 'id',
    USERNAME = 'usuario',
    EMAIL = 'email',
    CODE = 'codigo',
}

export interface GetUsersParams {
    page: number;
    limit: number;
    search?: string;
    sortOrder?: string;
    sortBy?: UserSortField;
}

export type GetUsersResponse = PaginatedResponse<User[]>;

export interface GetLogsParams {
    page: number;
    limit: number;
    search?: string;
    sortOrder?: string;
    sortBy?: string;
}

export interface Log {
    id: number;
    user: string;
    type_log: string;
    field: string;
    log: string;
    details: string | null;
    date_timer: string;
}

export type GetLogsResponse = PaginatedResponse<Log[]>;