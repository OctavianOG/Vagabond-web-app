import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import { useRoutes } from "react-router-dom";
import { trpc } from "./trpc";
import routes from "./router";
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import AuthMiddleware from "./middleware/Auth.middleware";

const AppContent = () => {
  const content = useRoutes(routes);
  if (typeof window !== "undefined") {
    injectStyle();
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {content}
    </>
  );
};

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        httpBatchLink({
          url: "http://localhost:3000/api",
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <CookiesProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthMiddleware>
            <AppContent />
          </AuthMiddleware>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </trpc.Provider>
    </CookiesProvider>
  );
};

export default App;
