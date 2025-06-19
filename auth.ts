import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { getUser } from './app/login/actions'
import OktaProvider from 'next-auth/providers/okta'
import { OKTA_CLIENT_ID, OKTA_CLIENT_SECRET, OKTA_ISSUER } from './lib/utils'

console.log('OKTA ENV', {
  clientId: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID,
  issuer: process.env.NEXT_PUBLIC_OKTA_ISSUER
})
// Define the table name and primary key
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials: any) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email, password)

          if (!user) return null

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name, // Add this line
              emailVerified: new Date()
            }
          } else {
            return null
          }
        }

        return null
      }
    }),
    OktaProvider({
      clientId: OKTA_CLIENT_ID,
      clientSecret: OKTA_CLIENT_SECRET,
      issuer: OKTA_ISSUER
    })
    // MicrosoftEntraID({
    //   clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
    //   clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
    //   issuer: `https://login.microsoftonline.com/${AUTH_MICROSOFT_ENTRA_ID_ISSUER}/v2.0`,
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name // Add this line
        token.emailVerified = new Date()
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string, // Add this line
          emailVerified: token.emailVerified as Date
        }
      }
      return session
    }
  },
  trustHost: true
})
