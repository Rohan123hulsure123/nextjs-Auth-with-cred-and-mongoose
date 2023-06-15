import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    import('flowbite')
}, [])//really imp for using flowbite interactve components won't work without this 
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <ToastContainer position="top-center" theme="colored"/>
    </SessionProvider>
  )
}