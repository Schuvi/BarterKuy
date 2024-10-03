import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";
import App from "./App.tsx";
import "./index.css";
import PreventPullRefresh from "./utils/preventRefresh.tsx";

const queryClient = new QueryClient({});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID_GOOGLE}>
        <Provider store={store}>
          <PreventPullRefresh>
            <App />
          </PreventPullRefresh>
        </Provider>
      </GoogleOAuthProvider>
    </StrictMode>
    <ReactQueryDevtools />
  </QueryClientProvider>
);
