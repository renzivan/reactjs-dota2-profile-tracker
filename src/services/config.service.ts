import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosHeaders } from "axios"

interface THttpModuleOptions extends AxiosRequestConfig {}

class HttpService {
  private http: AxiosInstance

  constructor(private readonly instance = axios) {
    this.http = this.instance.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 30000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.http.interceptors.request.use((config) => {
      const headers = new AxiosHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      })

      config.headers = headers

      return config
    })

    this.http.interceptors.response.use(
      async (response: AxiosResponse) => response,
      async (error) => {
        console.error('error: ', error)
        // Reject the promise with the error so the caller can handle it
        return Promise.reject(error)
      }
    )
  }

  get<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: THttpModuleOptions
  ): Promise<AxiosResponse<T>> {
    return this.http.get<T>(url, {
      params: data,
      validateStatus: (status: number) => status === 200,
      ...config,
    })
  }
}

export const http = new HttpService()
