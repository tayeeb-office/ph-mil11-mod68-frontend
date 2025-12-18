import React, { useContext } from 'react';
import { AuthContext } from './Provider';
import Loading from "../Pages/Loading"; 
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {

    const {user, loading, roleloading, status} = useContext(AuthContext);

    const location = useLocation();

    if(loading || roleloading){
        return <Loading />
    }

    if(!user || !status =="active"){
        
        return <Navigate state={location.pathname} to='/login'></Navigate>
        
    }

    return children;

};

export default PrivateRoute;