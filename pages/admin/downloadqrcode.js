import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Head from "next/head";
import Spinner from "../../components/spinner";

export default function Component() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState({ files: [] });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("false");
  //   const [newerFiles, setNewerFiles] = useState(1);
  /*
    #TODO
    1) Create a use effect which load 1st 5 zip file records from DB(implement pagination, sort, search, filter, and number of records  )
    2) Then show them on screen 
    3) Option to load 5 more
    find a way to impliment datatables in this 
 */
  async function fetchData() {
    try {
      setLoading("true")
      const response = await fetch("/api/admin/qrcode/1", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      } else {
        // console.log(result);
        if (result.files.length > 0) {
          // console.log(result);
          setData(result);
          setLoading("false")
          // console.log(data);
          setMessage("");
        } else {
          setMessage("No files to download.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  if (session?.user.role === 'admin') {
    // console.log(session);
    return (
      <>
        {/* Signed in as {session.user.username} <br />
         {message? message.message + " : " + message.test:""}
        <button onClick={() => signOut()}>Sign out</button> */}
        <Head>
          <title>PawFurEver | Download QR code</title>
        </Head>
        <Navbar />
        <Sidebar as="/downloadqrcode" />
        {/* Main content div */}
        <div className="p-4 sm:ml-64">
          <div className="p-1 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className=" p-4 ">
              <h1 className="text-3xl p-0">Download QR Tag</h1>
              {/* <TableComponent data={data}/> */}
              <Spinner loading={loading} />
              <div
                className={`p-2 m-5 ${data.files.length == 0 ? "hidden" : ""}`}
              >
                {data.files.map((item, index) => {
                  //   console.log(item);
                  return (
                    <div
                      key={index + 1}
                      className="block p-6 mb-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      <a href={item.downloadUrl} className="float-right hover:text-blue-600 ">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          className="w-10 h-10 ml-4"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                          ></path>
                        </svg>
                        Download
                      </a>
                      <h5 className="mb-2 text-2xl  break-words  text-gray-900 dark:text-white">
                        File name : <b>{item.fileName}</b>
                      </h5>

                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        For : <b>{item.ForWhom}</b> &nbsp; File type :{" "}
                        <b>{item.fileType}</b> &nbsp; Number of QR tags inside:{" "}
                        <b>{item.numberOFQRCodes}</b>
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="m-5">{message}</p>
            </div>
          </div>
        </div>
      </>
    );
  }else {
    return (<div className="text-3xl flex items-center justify-center h-screen">
      <h1 className="p-0 m-0">Unauthorized Access</h1>
    </div>)
  }
  // return (
  //     <>
  //       Protected<br />
  //       <button onClick={() => signIn()}>Sign in</button>
  //     </>
  //   )
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
