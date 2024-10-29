import { message } from 'antd'
import axios, { type AxiosRequestConfig, type Method } from 'axios'

export interface IResponse<T> {
  code: number
  message: string
  data: T
}

export interface IRequestOption extends AxiosRequestConfig {
  /**
   * 跳过统一错误消息
   */
  skipCommonMessage?: boolean
}

const noneBodyMethod = ['GET', 'DELETE']

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

const request = <T>(
  url: string,
  method: Method,
  submitData?: object,
  options: IRequestOption = {},
): Promise<T> => {
  const { headers: customHeader, ...restOptions } = options
  return instance.request({
    url,
    method,
    [noneBodyMethod.includes(method) ? 'params' : 'data']: submitData,
    headers: {
      'Content-Type': noneBodyMethod.includes(method)
        ? undefined
        : 'application/json',
      ...customHeader,
    },
    ...restOptions,
  })
}

instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  ({ data, config }) => {
    console.log(data, 'response data')
    if (data.code === 0) {
      return data.data
    }
    if ((config as IRequestOption).skipCommonMessage) {
      return Promise.reject(data)
    }
    message.error(data.message || data.msg)
    return Promise.reject(data)
  },
  (error) => {
    console.log(error, 'response error')
    if (error.config.skipCommonMessage) {
      return Promise.reject(error)
    }
    message.error(error.message ? error.message : error.response?.data.message)
    return Promise.reject(error)
  },
)

export const get = <T>(
  url: string,
  submitData?: object,
  options?: IRequestOption,
) => request<T>(url, 'GET', submitData, options)

export const post = <T>(
  url: string,
  submitData?: object,
  options?: IRequestOption,
) => request<T>(url, 'POST', submitData, options)

export const put = <T>(
  url: string,
  submitData?: object,
  options?: IRequestOption,
) => request<T>(url, 'PUT', submitData, options)

export const del = <T>(
  url: string,
  submitData?: object,
  options?: IRequestOption,
) => request<T>(url, 'DELETE', submitData, options)
