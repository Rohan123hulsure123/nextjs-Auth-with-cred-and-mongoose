import { providers, signIn, getSession, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

function signin({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { session } = getSession();
  const router = useRouter();

  return (
    <div>
      <h1>Sign in</h1>
      <h4 style={{ color: "red" }}>
        {error == "CredentialsSignin" ? "Invalid credentials" : ""}
      </h4>
      <h3 style={{color: 'green'}}>
        {router.query.message?router.query.message:""}
      </h3>
      <input
        type="text"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="abc@gmail.com"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="**********"
      />
      <button
        onClick={async () => {
          try {
            const res = await signIn("Credentials", {
              email,
              password,
              redirect: false,
            });
            // console.log(res);
            if (!res.error) {
              router.replace("/protected");
            }
            setError(res.error);
          } catch (error) {
            console.log(error);
          }
         
        }}
      >
        Signin
      </button>
    </div>
  );
}

export default signin;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      // providers: await providers(context),
      csrfToken: await getCsrfToken(context),
    },
  };
}
