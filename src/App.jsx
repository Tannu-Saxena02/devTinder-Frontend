import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Terms from "./components/Terms";
import Chat from "./components/Chat";
import OtpVerification from "./components/OtpVerification";
import Privacy from "./components/Privacy";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import ForgotPassword from "./components/forgotPassword";
import Requests from "./components/Requests";


function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body/>}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<Login />} />
                 <Route path="signup" element={<Signup />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="feed" element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="chat/:targetUserId" element={<Chat />} />
              <Route path="otpverification" element={<OtpVerification />} />
              <Route path="forgotpassword" element={<ForgotPassword/>} />
              <Route path="resetpassword" element={<ForgotPassword/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
