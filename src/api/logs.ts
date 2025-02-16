import axios from '@/lib/axios';
import { LogsResponse } from '@/types/log';
import { GetLogsParams } from '@/types/log';

export const logsApi = {
    async getLogs({ page, limit: size, search, order, sortBy }: GetLogsParams): Promise<LogsResponse> {
        const response = await axios.get<LogsResponse>('/auth/user/logs', {
            params: {
                page,
                size,
                search,
                order,
                sortBy
            }
        });
        return response.data;
    },
}; 