import type { AxiosError } from 'axios'
import type { ApiToken, LoginCredentials, RegisterData, User } from 'src/contracts'
import { api } from 'src/boot/axios'

interface RegisterReturnInterface {
  user: User,
  apiToken: ApiToken
}

class AuthService {
  async me (): Promise<User | null> {
    return api.get(
      'auth/me'
    )
      .then((response) => response.data)
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          return null
        }

        return Promise.reject(error)
      })
  }

  async register (data: RegisterData): Promise<RegisterReturnInterface> {
    const response = await api.post<RegisterReturnInterface>('auth/register', data)
    return response.data
  }

  async login (credentials: LoginCredentials): Promise<ApiToken> {
    const response = await api.post<ApiToken>('auth/login', credentials)
    return response.data
  }

  async logout (): Promise<void> {
    await api.post('auth/logout')
  }
}

export default new AuthService()
