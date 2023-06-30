import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Link from "next/link";
import Head from "next/head";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function Component() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState();
  const router = useRouter();
  //   useEffect( ()=>{
  //     async function fetchData(message) {
  //       const response = await fetch('/api/test', {
  //         method: 'POST',
  //         body: JSON.stringify({ test:"Euuu" }),
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.message || 'Something went wrong!');
  //       }

  //       console.log(data);
  //       setMessage(data);
  //     }
  //     fetchData()
  //   },[])
  if (session) {
    // console.log(session);

    return (
      <>
        <Head>
          <title>PawFurEver | Dashboard</title>
        </Head>

        <Navbar />
        <Sidebar as="/dashboard" />

        <div className="p-4 sm:ml-64">
          <div className="p-1 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className=" p-4 h-96">
            
              <h1 className="text-3xl p-0">Dashboard</h1>
              {/* <img src="/output-test.svg"></img> */}
              {/* <span className="ml-3">Welcome {session.user.username}</span> */}
              
            </div>
            <div className="h-96"></div>
            <div className="h-96"></div>
            <div className="h-96"></div>
          </div>
        </div>
      </>
    );
  }
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
