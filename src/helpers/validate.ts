import { Input } from '../types'
export const usernameRegex = new RegExp(/^[A-Z0-9]{6,24}$/i)
export const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
)
export const usernameError =
  'Username should contain 4-25 characters and must be unique'
export const passwordError =
  'Password should contain at least 8 characters long and contain at least 1 of - uppercase, lowercase and one number'

export const validateUsername = (id: string): boolean => {
  if (id && (id.length < 5 || id.length > 18 || !usernameRegex.test(id))) {
    return false
  }

  return true
}

export const validatePassword = (id: string): string => {
  if (!passwordRegex.test(id)) {
    return passwordError
  }
  return ''
}

export const validate = (options: Input) => {
  if (!validateUsername(options.username)) {
    return usernameError
  }

  validatePassword(options.password)

  return null
}
