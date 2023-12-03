import bcrypt from 'bcryptjs'
import Cryptr from 'cryptr'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import { collections, dbConnect } from '@backend/utils'
import jwt from 'jsonwebtoken'
import { JWT } from 'next-auth/jwt'

const cryptr = new Cryptr(process.env.CRYPTR_SECRET as string)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      type: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'johndoe@test.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        await dbConnect()
        const user = await collections.users?.findOne({ email: credentials?.email })

        if (!user) {
          throw new Error('Incorrect email or password')
        }

        const passwordsMatch = await bcrypt.compare(credentials?.password || '', user.password)

        if (!passwordsMatch) {
          throw new Error('Incorrect email or password')
        }

        const decryptedMapsAPIKey = user.mapsAPIKey ? cryptr.decrypt(user.mapsAPIKey) : ''

        if (req.headers?.host === 'www.geohub.gg') {
          await collections.users?.findOneAndUpdate({ _id: user._id }, { $set: { onNewDomain: true } })
        }

        // return user with access token
        let userObject = {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          isAdmin: user.isAdmin,
          distanceUnit: user.distanceUnit,
          mapsAPIKey: decryptedMapsAPIKey,
        }
        let accessToken = jwt.sign({...userObject}, process.env.NEXTAUTH_SECRET as string, { expiresIn: '30d' })
        return { ...userObject, accessToken };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        const { accessToken, ...u } = user as any
        token.user = u
        token.accessToken = accessToken
      }

      return token
    },
    session: async ({ session, token, user }) => {
      session.user = token.user as any
      session.accessToken = token.accessToken as any

      return session
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    // async encode({ secret, token, maxAge }) {
    //   const encodedToken = jwt.sign({...token}, secret, { algorithm: 'HS256' })
    //   return encodedToken
    // },
    // async decode({ secret, token }) {
    //   if (typeof token === 'undefined') return null;
    //   const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] })
    //   return decodedToken as JWT
    // },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    signOut: '/',
  },
}

export default NextAuth(authOptions)
