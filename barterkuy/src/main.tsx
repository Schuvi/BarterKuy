import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import  { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {Provider} from 'react-redux'
import store from './redux/store.tsx'
import App from './App.tsx'
import './index.css'
import PreventPullRefresh from './utils/preventRefresh.tsx'

const queryClient = new QueryClient({})

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <BrowserRouter>
        <GoogleOAuthProvider clientId='949324732079-at3sv25k0o8hn7ffcskd56677v7p2ql7.apps.googleusercontent.com'>
          <Provider store={store}>
            <PreventPullRefresh>
              <App />
            </PreventPullRefresh>
          </Provider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </StrictMode>
    <ReactQueryDevtools />
  </QueryClientProvider>,
)
