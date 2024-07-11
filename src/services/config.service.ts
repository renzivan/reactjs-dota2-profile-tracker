/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosHeaders  } from "axios"

interface THttpModuleOptions extends AxiosRequestConfig {}

class HttpService {
  private http: AxiosInstance

  constructor(private readonly instance = axios) {
    this.http = this.instance.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 30000
    })
  }

  private interceptor() {
    this.http.interceptors.request.use((config) => {
      const headers: AxiosHeaders = new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      })

      config.headers = headers

      return config
    })

    this.http.interceptors.response.use(
      async (response: AxiosResponse) => response,
      async (error) => {
        console.error('error: ', error);
        // Reject the promise with the error so the caller can handle it
        return Promise.reject(error);
      }
    )
  }

  get<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: THttpModuleOptions
  ): Promise<AxiosResponse<T & any>> {
    this.interceptor()
    return this.http
      .get(url, {
        params: data && data,
        validateStatus: (status: any) => status === 200,
        ...config,
      })
  }
}

export const http = new HttpService()
