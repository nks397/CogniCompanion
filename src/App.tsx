import { useContext } from "react"
import { Navigate, Routes, Route} from "react-router-dom"
import { UserContext } from "./context/UserProvider"
import Registration from "./pages/Registration"
import Home from "./pages/Home"
import PasswordReset from "./components/Forms/PasswordReset"
import ForgotPassword from "./components/Forms/ForgotPassword"
import Games from "./pages/Games"
import Meds from "./pages/Meds"
import LocationTracker from "./pages/LocationTracker"
import MoodTracker from "./pages/MoodTracker"
export default function App() {
  const { currentUser } = useContext(UserContext)
 
  return (
    <>
      <Routes>
        <Route path="/" element={ currentUser ? <Home /> : <Navigate to="/registration" replace />}
        />
        <Route path="/registration" element={ currentUser ? <Navigate to="/" replace /> : <Registration />}
          />
        <Route  path="/forgot-password" element={<ForgotPassword />} 
        />
        <Route path="/emulator/action" element={<PasswordReset />} 
        />
        <Route path="/games" element={ currentUser ? <Games /> : <Navigate to="/registration" replace />}
        />
        <Route path="/meds" element={ currentUser ? <Meds /> : <Navigate to="/registration" replace />}
          />
        <Route path="/location-tracker" element={currentUser ? <LocationTracker /> : <Navigate to="/registration" replace />} 
        />
        <Route path="/mood-tracker" element={currentUser ? <MoodTracker /> : <Navigate to="/registration" replace />} 
        />
      </Routes>
    </>
  )
}
