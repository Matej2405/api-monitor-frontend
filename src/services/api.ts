import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface APIRequest {
  id: number;
  method: string;
  path: string;
  response_code: number;
  response_time: number;
  response_body?: string;
  created_at: string;
}

export interface Problem {
  id: number;
  request_id: number;
  problem_type: string;
  severity: string;
  description: string;
  created_at: string;
}

export interface RequestParams {
  method?: string;
  min_response_time?: number;
  max_response_time?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort_by?: 'created_at' | 'response_time';
  order?: 'asc' | 'desc';
}

export const requestsAPI = {
  getAll: (params: RequestParams = {}) => {
    return api.get<APIRequest[]>('/requests', { params });
  },
  
  proxy: (endpoint: string, method: string = 'GET', data: any = null) => {
    return api({
      method,
      url: `/proxy/${endpoint}`,
      data,
    });
  },
};

export const problemsAPI = {
  getAll: (params: Partial<RequestParams> = {}) => {
    return api.get<Problem[]>('/problems', { params });
  },
};

export default api;