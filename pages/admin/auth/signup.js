import { providers, signIn, getSession, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

function signup({ csrfToken }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { session } = getSession();
  const router = useRouter();

  async function handleSignup() {
    // console.log("yo");
    const response = await fetch("/api/admin/user", {
      method: "POST",
      body: JSON.stringify({username, email, password}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Something went wrong!")
    } else{
      router.replace({ pathname:"/admin/auth/signin", query:{ message:'User registered successful' }})
    }
    
  }
  return (
    <div>
      <h1>Sign in</h1>
      <h4 style={{ color: "red" }}>
        {error ? error:""}
      </h4>
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        placeholder="Don don"
      />
      <input
        type="email"
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
      <button onClick={() => handleSignup()}>Sign up</button>
      <button onClick={() => router.replace("/admin/auth/signin")}>
        Login insted
      </button>
    </div>
  );
}

export default signup;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session?.user.role === 'admin') {
    return {
      redirect: { destination: "/admin/dashboard" },
    };
  } 
  if (session?.user.role === 'user') {
    return {
      redirect: { destination: "/user" },
    }; 
  }
  return {
    props: {
      // providers: await providers(context),
      csrfToken: await getCsrfToken(context),
    },
  };
}
