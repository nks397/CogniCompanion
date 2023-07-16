import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from "./context/UserProvider.tsx"

import './index.css'
import MedsProvider from './context/MedsProvider.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <MedsProvider>
          <App />
        </MedsProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
