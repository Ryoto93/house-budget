import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { Adapter } from "next-auth/adapters"

// セッションの型を拡張
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const authOptions: NextAuthOptions = {
  // Prismaをデータベースアダプターとして設定
  adapter: PrismaAdapter(prisma) as Adapter,
  
  // 認証プロバイダーを設定 (Google)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // セッション管理の方法
  session: {
    strategy: "database", // JWTではなくデータベースセッションを使用
  },

  // コールバック関数
  callbacks: {
    async session({ session, user }) {
      // セッションオブジェクトにユーザーIDを追加
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // セッション暗号化のための秘密鍵
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 