import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Head from "next/head";
import Spinner from "../../components/spinner";
import { toast } from "react-toastify";

export default function Component() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("false");
  const [numberOfQRTags, setNumberOfQRTags] = useState(0);
  const [QRTagsForWhom, setQRTagsForWhom] = useState("");
  const [QRCodeType, setQRCodeType] = useState("");
  const [numberOfError, setNumberOfError] = useState("");
  const [forWhomError, setforWhomError] = useState("");
  const [QRTypeError, setQRTypeError] = useState("");

  async function handleSubmit() {
    try {
      // Validation
      if (!Number.isFinite(numberOfQRTags) || !numberOfQRTags > 0) {
        setNumberOfError("* Please Enter valid number.");
      } else if (QRTagsForWhom.length == 0) {
        setforWhomError("* Please Enter valid input.");
      } else if (!QRCodeType || QRCodeType == "Choose a country") {
        setQRTypeError("* Please select a type");
      } else {
        // Send Data to server
        setLoading("true");
        setMessage("QR code is being created please wait.");
        const response = await fetch("/api/admin/qrcode/new2", {
          method: "POST",
          body: JSON.stringify({ numberOfQRTags, QRTagsForWhom, QRCodeType }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong!");
        } else {
          const data = await response.json();
          console.log(data);
          toast(
            `QR codes created successfully.`,
            { hideProgressBar: true, autoClose: 2000, type: "success" }
          );
          setLoading("false");
          setMessage(
            <>
              Your file is ready to{" "}
              <a href={data.url[0]} className="underline text-pink-600">
                download.
              </a>{" "}
            </>
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  } 

  // setTimeout(() => {
  // setLoading("false");
  // setMessage(
  //   <>
  //     Your file is ready to{" "}
  //     <a href="#" className="underline">
  //       download.
  //     </a>{" "}
  //   </>
  // );
  // }, 1000);

  // useEffect(() => {
  //   async function fetchData(message) {
  //     const response = await fetch("/api/test", {
  //       method: "POST",
  //       body: JSON.stringify({ test: "Euuu" }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Something went wrong!");
  //     }

  //     // console.log(data);
  //     setMessage(data);
  //   }
  //   fetchData();
  // }, []);
  if (session?.user.role === 'admin') {
    // console.log(session);
    return (
      <>
        {/* Signed in as {session.user.username} <br />
         {message? message.message + " : " + message.test:""}
        <button onClick={() => signOut()}>Sign out</button> */}
        <Head>
          <title>PawFurEver | Generate QR code</title>
        </Head>
        <Navbar />
        <Sidebar as="/generateqrcode" />
        {/* Main content div */}
        <div className="p-4 sm:ml-64">
          <div className="p-1 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
            <div className=" p-4 ">
              <h1 className="text-3xl p-0">Generate QR Tag</h1>
              {/* Input div */}
              <div className="p-4 pb-10 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 grid gap-6 mb-6 lg:grid-cols-4">
                <div className="pt-2 ">
                  <label
                    htmlFor="numberOfQrCodes"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Number of QR tags: <br />{" "}
                    <span className="text-red-700">{numberOfError}</span>
                  </label>
                  <input
                    type="number"
                    id="numberOfQrCodes"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="25"
                    required
                    onChange={(e) => {
                      setNumberOfError("");
                      setNumberOfQRTags(parseInt(e.target.value));
                    }}
                  />
                </div>
                <div className="pt-2">
                  <label
                    htmlFor="for"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    For: <br />{" "}
                    <span className="text-red-700">{forWhomError}</span>
                  </label>
                  <input
                    type="text"
                    id="for"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Amazon, Walmart, etc."
                    required
                    onChange={(e) => {
                      setforWhomError("");
                      setQRTagsForWhom(e.target.value);
                    }}
                  />
                </div>
                <div className="pt-2">
                  <label
                    htmlFor="countries"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select QR type <br />{" "}
                    <span className="text-red-700">{QRTypeError}</span>
                  </label>
                  <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setQRTypeError("");
                      setQRCodeType(e.target.value);
                    }}
                  >
                    <option defaultValue={true}>Choose a country</option>
                    <option value="SVG">SVG</option>
                    <option value="PNG">PNG</option>
                  </select>
                </div>
                <div className="pt-8">
                  <button
                    className="flex flex-row justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full p-2.5"
                    type="button"
                    onClick={handleSubmit}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      className="w-6 h-6"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    &nbsp; Create
                  </button>
                </div>
              </div>
              <div className="pt-4 flex flex-row justify-center">
                <Spinner loading={loading} />
                &nbsp;
                <h3 className="text-2xl pt-1.5 ">{message}</h3>
              </div>
              {/* <div>
              <label for="numberOfQrCodes">Number of QR tags:</label>
              <input id="numberOfQrCodes" type="number" placeholder="E.g. 24"/>
              </div> */}
            </div>
            {/* <div className="h-96">asda  </div>
            <div className="h-96"></div>
            <div className="h-96"></div> */}
          </div>
        </div>
      </>
    );
  } else {
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
