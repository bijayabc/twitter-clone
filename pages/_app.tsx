import "@/styles/globals.css";
import {GoogleOAuthProvider} from "@react-oauth/google"
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="144841113673-ehfqt75vat98vji0ogpsun45toic0nuu.apps.googleusercontent.com">
      <Component {...pageProps} />;
      <Toaster />
    </GoogleOAuthProvider>
  )
}
