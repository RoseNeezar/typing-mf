import React, { FC } from "react";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});
const Client: FC<{ mf?: string }> = ({ mf }) => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={mf ? `/${mf}` : "/"}>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

const Mount = (el: HTMLElement, mf?: string) => {
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <Client mf={mf} />
    </React.StrictMode>
  );
};

const devRoot = document.getElementById("typeracer-root") as HTMLElement;

if (devRoot) {
  Mount(devRoot);
}

export { Mount };
