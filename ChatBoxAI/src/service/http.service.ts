import type { AxiosRequestConfig } from 'axios'
import { apiClient } from '@/configs/apiClient'
type RequestBody = unknown
async function unwrapMetadata<TMetadata>(request: Promise<{ data: ApiResponse<TMetadata> }>) {
  const response = await request
  return response.data.metadata
}

export const httpService = {
  async postRaw<TResponse, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.post<TResponse>(url, body, config)
    return response.data
  },
  async get<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapMetadata<TMetadata>(apiClient.get<ApiResponse<TMetadata>>(url, config))
  },
  async post<TMetadata, TBody = RequestBody>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(apiClient.post<ApiResponse<TMetadata>>(url, body, config))
  },
  async put<TMetadata, Tbody = RequestBody>(
    url: string,
    body?: Tbody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(apiClient.put<ApiResponse<TMetadata>>(url, body, config))
  },
  async patch<TMetadata, Tbody = RequestBody>(
    url: string,
    body?: Tbody,
    config?: AxiosRequestConfig,
  ) {
    return unwrapMetadata<TMetadata>(apiClient.patch<ApiResponse<TMetadata>>(url, body, config))
  },
  async delete<TMetadata>(url: string, config?: AxiosRequestConfig) {
    return unwrapMetadata<TMetadata>(apiClient.delete<ApiResponse<TMetadata>>(url, config))
  },
  //   ===============================================================================
  async getApiResponse<TMetadata>(url: string, config?: AxiosRequestConfig) {
    const response = await apiClient.get<ApiResponse<TMetadata>>(url, config)
    return response.data
  },
  async postApiResponse<TMetadata, Tbody = RequestBody>(
    url: string,
    body: Tbody,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.post<ApiResponse<TMetadata>>(url, body, config)
    return response.data
  },
  async putApiResponse<TMetadata, Tbody = RequestBody>(
    url: string,
    body: Tbody,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.put<ApiResponse<TMetadata>>(url, body, config)
    return response.data
  },
  async patchApiResponse<TMetadata, Tbody = RequestBody>(
    url: string,
    body: Tbody,
    config?: AxiosRequestConfig,
  ) {
    const response = await apiClient.patch<ApiResponse<TMetadata>>(url, body, config)
    return response.data
  },
  async deleteApiResponse<TMetadata>(url: string, config?: AxiosRequestConfig) {
    const response = await apiClient.get<ApiResponse<TMetadata>>(url, config)
    return response.data
  },
}
