/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from "axios"

class HttpService {
  private http: AxiosInstance

  constructor(private readonly instance = axios) {
    this.http = this.instance.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 30000,
      paramsSerializer: function (params) {
        return qs.stringify(params, {
          encode: false,
        })
      },
    })
  }

  private interceptor() {
    this.http.interceptors.request.use((config) => {
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`
      }

      return config
    })

    this.http.interceptors.response.use(async (response: AxiosResponse) => {
      return response
    })
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
        validateStatus: (status: any) =>
          status === 200,
        ...config,
      })
      .catch((error) => {
        // TempFix: If Token expired, then redirect user to login page
        if (error.response.status === 401) {
          cookieHelper.removeCookie("access_token")
        }
        throw error(
          "Server is busy, please try again later",
          501
        )
      })
  }
}

export const http = new HttpService()
