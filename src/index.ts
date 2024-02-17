import 'reflect-metadata'
import express from 'express'
import session from 'express-session'
import db from './conn'
import cors from 'cors'
import path from 'path'
// import { createClient } from 'redis'
// import connectRedis from 'connect-redis'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { __prod__, COOKIE, PORT } from './consts'
import { MyContext } from './types'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

const main = async () => {
  // Connect to Database
  await db.initialize()
  await db.runMigrations()

  const app = express()

  // const RedisStore = connectRedis(session)
  // const RedisClient = createClient({ legacyMode: true })

  // await RedisClient.connect()

  app.set('trust proxy', __prod__)

  app.use(
    cors({
      origin: ['http://localhost:3002'],
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: !__prod__,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.join(__dirname + '/resolvers/*.ts')],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(PORT, () =>
    console.log(`🚀 Server started on http://localhost:${PORT}`)
  )
}

main()
