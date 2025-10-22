import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth Configuration
 * This is a basic setup for authentication
 * Customize based on your authentication requirements
 */
const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Implement actual authentication logic
        // This is a placeholder implementation
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Replace with actual user validation
        if (
          credentials.email === 'admin@example.com' &&
          credentials.password === 'admin123'
        ) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin User',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
