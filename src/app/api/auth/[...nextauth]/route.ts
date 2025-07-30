import NextAuth, { Session, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

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

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 他のプロバイダー（例: GitHub）もここに追加可能
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      // セッション情報にユーザーIDを含める
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // セッション暗号化のための秘密鍵
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 