import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from "next-auth/react";

import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF, FaTwitter } from "react-icons/fa";

function signin({ csrfToken, proivders }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const { session } = getSession();
  const router = useRouter();
  const [loading, setLoading] = useState({ key: "", status: false });

  async function handleSignIn(provider) {
    console.log(provider);
    switch (provider) {
      case "google":
        try {
          // e.preventDefault();
          setLoading({ key: "google", status: true });
          // console.log()

          const res = await signIn("google");

          if (res.error) {
            setError(res.error);
            toast(
              `${
                res.error == "CredentialsSignin"
                  ? "Invalid credentials"
                  : res.error
              }`,
              { hideProgressBar: true, autoClose: 2000, type: "error" }
            );
            setLoading({ key: "google", status: false });
          }
          // else {
          //   console.log(res);
          //   router.replace("/admin/dashboard");
          // }
        } catch (error) {
          setLoading({ key: "google", status: false });
          console.log(error);
          toast(
            `${
              error == "CredentialsSignin"
                ? "Invalid credentials"
                : "Something went wrong please try again."
            }`,
            { hideProgressBar: true, autoClose: 2000, type: "error" }
          );
        }
        break;
      case "credentials":
        try {
          // e.preventDefault();
          setLoading({ key: "credentials", status: true });
          // console.log()

          const res = await signIn("Credentials", {
            email,
            password,
            redirect: false,
          });

          if (res.error) {
            setError(res.error);
            toast(
              `${
                res.error == "CredentialsSignin"
                  ? "Invalid credentials"
                  : res.error
              }`,
              { hideProgressBar: true, autoClose: 2000, type: "error" }
            );
            setLoading({ key: "credentials", status: false });
          } else {
            console.log(res);
            router.reload();
            // router.replace("/admin/dashboard");
          }
        } catch (error) {
          setLoading({ key: "credentials", status: false });
          console.log(error);
          toast(
            `${
              error == "CredentialsSignin"
                ? "Invalid credentials"
                : "Something went wrong please try again."
            }`,
            { hideProgressBar: true, autoClose: 2000, type: "error" }
          );
        }
        break;
    }
  }
  // console.log(Provider);
  // const providers = await getProviders();
  // console.log(providers);
  return (
    <div
      className=" h-screen flex flex-wrap items-center"
      style={
        {
          // backgroundImage: 'url("../../bg-image2.png")',
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
        }
      }
    >
      <Head>
        <title>PawFurEver | Sign In</title>
      </Head>
      <div className="lg:w-2/6 md:w-1/2 bg-white rounded-lg-lg p-8 flex flex-col md:ml-auto w-full mx-auto md:mt-0 border">
        <h1 className="text-3xl font-bold pb-2 mx-auto text-gray-700">
          Sign In
        </h1>
        <h4 className="text-red-600 mx-auto">
          {error == "CredentialsSignin" ? "Invalid credentials" : ""}
        </h4>
        <div className="relative mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="jhon@gmail.com"
            className="w-full bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4 pb-5">
          <label htmlFor="password" className="leading-7 text-sm text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="**********"
            className="w-full bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <button
          className="text-white bg-[#1f164d] border-0 w-full py-2 px-8 focus:outline-none hover:bg-[#31217f] rounded-lg text-lg"
          type="submit"
          onClick={() => handleSignIn("credentials")}
        >
          <ClipLoader
            color={"white"}
            loading={loading.key == "credentials" ? loading.status : false}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          &nbsp;&nbsp;Submit
        </button>

        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
            OR
          </span>
        </div>
        
        {/* Oauth sign in buttons */}
        <div className="grid sm:grid-cols-2 gap-2">
          <button
            className="col-6 w-full mt-3 text-grey bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-indigo-600 text-sm rounded-lg  px-8 py-4  dark:focus:ring-[#4285F4]/55"
            type="submit"
            onClick={() => handleSignIn("google")}
          >
            <ClipLoader
              color={"white"}
              loading={loading.key == "google" ? loading.status : false}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <FcGoogle size={25} className="float-left"/>
            {/* &nbsp;  */}
            <span className="text-center">Sign in with Google</span>
            
          </button>
          {/* inline-flex justify-center items-center  */}
          {/* <button
            className="col-6 w-full sm:mt-3  text-white bg-[#050708] hover:bg-[#050708]/90  focus:ring-4 focus:outline-none focus:ring-indigo-600 text-sm rounded-lg  px-8 py-4 dark:focus:ring-[#4285F4]/55"
            type="submit"
            // onClick={() => handleSignIn("google")}
          >
            <ClipLoader
              color={"white"}
              loading={loading.key == "google" ? loading.status : false}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <FaApple size={25} className="float-left "/>
            <span className="text-center">Sign in with Apple</span>
          </button> */}
          {/* <button
            className="col-6 w-full text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-indigo-600 text-sm rounded-lg  px-8 py-4  dark:focus:ring-[#4285F4]/55"
            type="submit"
            // onClick={() => handleSignIn("google")}
          >
            <ClipLoader
              color={"white"}
              loading={loading.key == "google" ? loading.status : false}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <FaTwitter size={20} className="float-left"/>
            <span className="text-center">Sign in with Twitter</span>
          </button> */}
          <button
            className="col-6 w-full sm:mt-3 text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-indigo-600 text-sm rounded-lg  px-8 py-4  dark:focus:ring-[#4285F4]/55"
            type="submit"
            // onClick={() => handleSignIn("google")}
          >
            <ClipLoader
              color={"white"}
              loading={loading.key == "google" ? loading.status : false}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <FaFacebookF size={20} className="float-left"/>
            <span className="text-center">Sign in with Facbook</span>
          </button>
        </div>

        {/* <button
          id="google"
          className="text-white bg-indigo-500 border-0 w-full py-2 px-8 mt-2 focus:outline-none hover:bg-indigo-600 rounded-lg text-lg"
          type="submit"
          onClick={() => handleSignIn("google")}
        >
          <ClipLoader
            color={"white"}
            loading={loading.key == "google" ? loading.status : false}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          &nbsp;&nbsp;Sign in with google
        </button> */}
        {/* </form> */}
        <p className="text-xs text-gray-500 mt-5 mx-auto">
          <em>Copyright</em> &#169; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default signin;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session?.user.role === "admin") {
    return {
      redirect: { destination: "/admin/dashboard" },
    };
  }
  if (session?.user.role === "user") {
    return {
      redirect: { destination: "/user" },
    };
  }
  // console.log(context);
  return {
    props: {
      // providers: await getProviders(context),
      csrfToken: await getCsrfToken(context),
    },
  };
}
