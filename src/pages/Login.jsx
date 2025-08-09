import { useState } from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import AuthForm from "../components/AuthForm";
import {Link, useNavigate} from "react-router-dom";

export default function Login(){
    const [loading, setLoading]= useState(false);
    const [error, setError]= useState("");
    const navigate = useNavigate();

    const handleLogin=async(email,password)=>{
        setLoading(true);
        setError("");
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        }catch(err){
            setError(err.message.replace("Firebase: ", ""));
        }
        setLoading(false);
    };

    return(
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                 <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
                 <AuthForm onSubmit={handleLogin} loading={loading} error={error} buttonText="Login"/>
                 <p className="mt-4 text-sm text-center">  Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-600">Sign up</Link>
                 </p>
            </div>
        </div>
    );
}