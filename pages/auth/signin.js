import { providers, signIn, getSession, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Head from 'next/head';

function signin({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { session } = getSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div
      className=" h-screen flex flex-wrap items-center"
      style={{
        backgroundImage: 'url("../../bg-image2.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Head>
        <title>PawFurEver | Sign In</title>
      </Head>
      <div className="lg:w-2/6 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mx-auto md:mt-0 shadow-slate-800 shadow-xl ">
        <h1 className="text-3xl font-bold pb-2 mx-auto text-gray-700">Sign In</h1>
        <h4 className="text-red-600 mx-auto">
          {error == "CredentialsSignin" ? "Invalid credentials" : ""}
        </h4>
        <form
          className="p-4"
          onSubmit={async (e) => {
            try {
              e.preventDefault();
              setLoading(true);
              const res = await signIn("Credentials", {
                email,
                password,
                redirect: false,
              });
              // console.log(res);
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
                setLoading(false);
              } else {
                router.replace("/dashboard");
              }
            } catch (error) {
              setLoading(false);
              console.log(error);
              toast(
                `${
                  error == "CredentialsSignin" ? "Invalid credentials" : "Something went wrong please try again."
                }`,
                { hideProgressBar: true, autoClose: 2000, type: "error" }
              );
            }
          }}
        >
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
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4 pb-5">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
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
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            className="text-white bg-indigo-500 border-0 w-full py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            type="submit"
          >
            <ClipLoader
              color={'white'}
              loading={loading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
             &nbsp;&nbsp;Submit
          </button>
        </form>
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
