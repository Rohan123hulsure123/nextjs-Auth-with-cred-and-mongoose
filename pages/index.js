import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Component() {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session) {
    return {
      redirect: { destination: "/protected" },
    };
  }
  return { redirect: { destination: "/auth/signin" },props: {  } };
}
