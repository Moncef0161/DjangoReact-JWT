import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "./redux/store";
import axios from "axios";
import PrivateRoute from "@/components/PrivateRoute";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Profile from "@/pages/Profile/Profile";
import NotFound from "@/components/NotFound";

const AxiosInterceptor: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AxiosInterceptor>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AxiosInterceptor>
      </Router>
    </Provider>
  );
};

export default App;
