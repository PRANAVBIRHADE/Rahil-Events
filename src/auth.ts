import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string));

        if (!user || !user.password) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await db.select().from(users).where(eq(users.email, user.email as string)).limit(1);
        if (existingUser.length === 0) {
          try {
            await db.insert(users).values({
              name: user.name as string,
              email: user.email as string,
              role: 'PARTICIPANT',
            });
          } catch (error) {
            console.error('Failed to sync Google user to database:', error);
            return false;
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await db.select().from(users).where(eq(users.email, token.email as string)).limit(1);
        if (existingUser.length > 0) {
          token.role = existingUser[0].role;
          token.id = existingUser[0].id;
        } else {
          token.role = 'PARTICIPANT';
        }
      } else if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: { strategy: 'jwt' },
});
