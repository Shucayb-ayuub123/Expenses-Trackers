import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const Protect = ({ children }) => {

    const [isAuth, setIsAuth] = useState(null);

    const API = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        
        axios.defaults.withCredentials = true
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${API}/api/Auth/isAuth`)

                if (response.data.success) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }

            } catch (error) {
                setIsAuth(false);
            }
        };

        checkAuth();

    }, []);


    if (isAuth === null) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        border: "5px solid rgba(255,255,255,0.2)",
                        borderTop: "5px solid #00b4d8",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }} />
                    <h2 style={{
                        color: "#fff",
                        fontSize: "1.5rem",
                        fontFamily: "sans-serif",
                        letterSpacing: "1px",
                    }}>Loading...</h2>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }


    if (!isAuth) {
        return <Navigate to="/Login" />;
    }


    return children;
};


export default Protect;