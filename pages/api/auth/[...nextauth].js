import NextAuth from "next-auth/next";
// import GithubProvider from "next-auth/providers/github";
// import TwitterProvider from "next-auth/providers/twitter";
// import GoogleProvider from "next-auth/providers/google";
// import Auth0Provider from "next-auth/providers/auth0";

import db from "../../../utils/db";
import User from "../../../models/User";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });

        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user.id,
            name: user.name,
            email: user.email,
            image: "placeholder",
            isAdmin: user.isAdmin,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // Providers.Email({
    //   server: {
    //     host: "",
    //     port: "",
    //     auth: {
    //       user: "",
    //       pass: "",
    //     },
    //   },
    //   from: "",
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // token.userRole = "admin";
      if (user?.id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
};

export default NextAuth(authOptions);
