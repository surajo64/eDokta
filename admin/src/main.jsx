import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/adminContext.jsx'
import DoctorContextProvider from './context/doctorContext.jsx'
import AppContextProvider from './context/appContext.jsx'
import { LoadingProvider } from './context/LoadingContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
        <LoadingProvider>
          <App />
          </LoadingProvider>
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
)
