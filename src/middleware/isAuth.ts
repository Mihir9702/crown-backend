import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types'

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userid) {
    throw new Error('[isAuth] - Please log in')
  }

  return next()
}
