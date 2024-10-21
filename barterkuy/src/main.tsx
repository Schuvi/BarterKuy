import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import PreventPullRefresh from "./utils/preventRefresh.tsx";
import { persistedStore, persistor } from "./redux/redux-persist/store-persist.tsx";

const queryClient = new QueryClient({});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID_GOOGLE}>
        <Provider store={persistedStore}>
          <PreventPullRefresh>
            <PersistGate
              loading={
                <>
                  <h1>Loading...</h1>
                </>
              }
              persistor={persistor}
            >
              <App />
            </PersistGate>
          </PreventPullRefresh>
        </Provider>
      </GoogleOAuthProvider>
      <ReactQueryDevtools initialIsOpen={false}/>
    </StrictMode>
  </QueryClientProvider>
);
