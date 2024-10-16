import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
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
      async authorize(credentials): Promise<any> {
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
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
      }
      if (account && account.provider === "google") {
        token.googleAccessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};