import "@/styles/globals.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import {GoogleOAuthProvider} from "@react-oauth/google"
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

const queryclient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryclient}>
      <GoogleOAuthProvider clientId="144841113673-ehfqt75vat98vji0ogpsun45toic0nuu.apps.googleusercontent.com">
        <Component {...pageProps} />
        <Toaster />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  )
}
