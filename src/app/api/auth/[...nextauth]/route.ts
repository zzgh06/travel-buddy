import NextAuth from 'next-auth';
import type { AuthOptions, User as NextAuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcryptjs';

interface ExtendedUser extends NextAuthUser {
  id: string;
}

interface ExtendedToken extends JWT {
  id?: string;
  googleAccessToken?: string;
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select('+password') as IUser | null;
        if (user && user.password && typeof credentials.password === 'string') {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return { id: user._id.toString(), name: user.name, email: user.email };
          }
        }
        return null;
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60,
    updateAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user, account }: { token: ExtendedToken; user?: ExtendedUser; account?: any }) {
      if (user) {
        token.id = user.id;
      }
      if (account && account.provider === "google") {
        token.googleAccessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: ExtendedToken }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };