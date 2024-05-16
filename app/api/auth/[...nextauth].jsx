import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            type: "credentials",
            credentials: {
                username: { label: "Username", type: "username" },
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials, req){
                const res = await axios({
                    url: BACKEND_URL,
                    method: "POST",
                    data: credentials,
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json();
                if (res.ok && user) {
                    return user;
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        jwt: async ({ token, user }) => {
          if (user) {
            token.username = user.username;
            token.access_token = user.access_token;
          }

          return token;
        },
        session: ({ session, token, user }) => {
          if (token) {
            session.user.username = token.userName;
            session.user.access_token = token.access_token;
          }
          return session;
        },
    },
}

export default NextAuth(authOptions)