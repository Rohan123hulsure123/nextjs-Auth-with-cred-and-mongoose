import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/user";
import bcrypt from "bcrypt";

async function chechPassword(credPAss, userPass) {
  //check password
  return await bcrypt.compare(credPAss, userPass);
}

export const authOptions = {
  session: {
    jwt: true,
  },
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        // console.log(profile);
        return {
          // _id: profile.sub,
          id: profile.sub,
          username: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      id: "Credentials",
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        return await dbConnect()
          .then(async () => {
            // Add logic here to look up the user from the credentials supplied
            const user = await User.findOne({ email: credentials.email });
            // console.log(user);
            // console.log(process.env.NEXTAUTH_SECRET);
            if (!user) {
              return null;
            }
            const result = await chechPassword(
              credentials.password,
              user.password
            );
            if (result) {
              // Any object returned will be saved in `user` property of the JWT
              // console.log(user);

              return user;
            } else {
              return null;
            }
          })
          .catch((err) => {
            console.error(err);
            return null;
          });
      },
    }),
  ],
  // All of this is just to add user information to be accessible for our app in the token/session
  callbacks: {
    // We can pass in additional information from the user document MongoDB returns
    // This could be avatars, role, display name, etc...
    async jwt({ token, user }) {
      if (user) {
        // console.log("here" + user);
        token.user = {
          _id: user._id ? user._id : user.id,
          username: user.username,
          email: user.email,
          image: user.picture,
          role: user.role,
        };
      }
      return token;
    },
    // If we want to access our extra user info from sessions we have to pass it the token here to get them in sync:
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
  theme: {
    colorScheme: "dark",
  },
  pages: {
    signIn: "/admin/auth/signin",
    // error: '/auth/error',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
export default NextAuth(authOptions);
