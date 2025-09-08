import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AppContextProvider  from './context/AppContext.jsx'
import { LoadingProvider } from "./context/loadingContext.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
    <LoadingProvider>
          <App />
    </LoadingProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
