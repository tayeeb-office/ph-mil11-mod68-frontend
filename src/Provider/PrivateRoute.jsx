import React, { useContext } from 'react';
import { AuthContext } from './Provider';
import Loading from "../Pages/Loading"; 
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {

    const {user, loading} = useContext(AuthContext);

    const location = useLocation();

    if(loading){
        return <Loading />
    }

    if(user){
        return children;
    }

    return <Navigate state={location.pathname} to='/login'></Navigate>

};

export default PrivateRoute;