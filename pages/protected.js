import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
export default function Component() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState()
  const router = useRouter();
  useEffect( ()=>{
    async function fetchData(message) {
      const response = await fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({ test:"Euuu" }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }
    
      // console.log(data);
      setMessage(data);
    }
    fetchData()
  },[])
 if (session) {
    console.log(session);
   return (
      <>
        Signed in as {session.user.username} <br />
         {message? message.message + " : " + message.test:""}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
}
// return (
//     <>
//       Protected<br />
//       <button onClick={() => signIn()}>Sign in</button>
//     </>
//   )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (!session) {
    return {
      redirect: { destination: "/" },
    };
  }
  return ({props: {session}})
}