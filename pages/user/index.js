// import { useRouter } from "next/router";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Component() {
  const { data: session, status } = useSession();
  const router = useRouter();
  

  return (<div className="text-3xl flex items-center justify-center h-screen">
      <h1 className="p-0 m-0">User {session.user.email}</h1> &nbsp;
      <img src={session.user.image} alt="profile pic"/>
      <button className="btn bg-gray-900 text-white" onClick={()=>signOut()}>signOut</button>
    </div>)
}


export async function getServerSideProps(ctx) {
    const session = await getSession(ctx);
    if (!session) {
      return {
        redirect: { destination: "/" },
      };
    }
    return { props: { session } };
  }
  