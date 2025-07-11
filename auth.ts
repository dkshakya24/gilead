import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { getUser } from './app/login/actions'

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
              name: user.name,
              role: user.role, // Add role from API response
              emailVerified: new Date()
            }
          } else {
            return null
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role // Add role to token
        token.emailVerified = new Date()
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string, // Add role to session
          emailVerified: token.emailVerified as Date
        }
      }
      return session
    }
  },
  trustHost: true
})
