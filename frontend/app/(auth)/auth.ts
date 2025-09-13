import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchAPI } from "@/lib/api";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      access_token: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    email?: string | null;
    access_token: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const data = await fetchAPI<{
            status: string;
            data?: { access_token: string };
          }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (data.status == "success" && data.data?.access_token) {
            const userData = await fetchAPI<{
              user_id: string;
              email: string;
            }>("/auth/me", {
              headers: {
                Authorization: `Bearer ${data.data.access_token}`,
              },
            });

            return {
              id: userData.user_id,
              email: userData.email,
              access_token: data.data.access_token,
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.id = user.id;
        // Set token expiry time (1 hour from now)
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.access_token = token.access_token as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour in seconds
  },
  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;
