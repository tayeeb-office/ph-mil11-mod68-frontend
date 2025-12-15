import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import auth from "../Firebase/firebase.config";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const Provider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  const register = (email, pass) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  useEffect(() => {
    const unsubscibe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscibe();
    };
  }, []);

  useEffect(() => {
    if(!user) return;
    axios.get(`http://localhost:5000/users/role/${user.email}`)
    .then(res =>{
      setRole(res.data.role)
    })
  }, [user]);

  const authData = {
    register,
    user,
    setUser,
    loading,
    role
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default Provider;
