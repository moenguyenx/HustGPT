import Credentials from "next-auth/providers/credentials";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const authOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            type: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials, req){
                try {
                    const res = await axios({
                        url: `${BACKEND_URL}/token`,
                        method: "POST",
                        data: credentials,
                        headers: { "Content-Type": "application/json" }
                    })
                    const user = await res.data;
                    if (user) {
                        return user;
                    }
                } catch (error) {
                    console.log(error);
                }
                
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24h
    },
    callbacks: {
        jwt: async ({ token, user }) => {
          if (user) {
            token.username = user.username;
            token.access_token = user.access_token;
          }

          return token;
        },
        session: async ({ session, token, user }) => {
          if (token) {
            session.user.username = token.username;
            session.user.access_token = token.access_token;
          }
          return session;
        },
    },
}