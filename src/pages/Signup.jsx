import { useState } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import AuthForm from "../components/AuthForm";
import {Link, useNavigate} from "react-router-dom";

export default function Signup(){
    const [loading, setLoading]= useState(false);
    const [error, setError]=useState("");
    const navigate= useNavigate();

    const handleSignup=async(email, password)=>{
        setLoading(true);
        setError("");
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        }
        catch(err){
            setError(err.message.replace("Firebase: ", ""));
        }
        setLoading(false);
    };

    return(
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
            <AuthForm onSubmit={handleSignup} loading={loading} error={error} buttonText="Signup"/>
            <p className="mt-4 text-sm text-center">
                Already have an account? <Link to="/Login" className="text-blue-500 hover:text-blue-600">Sign up</Link>
            </p>
        </div>
    </div>
    );
}