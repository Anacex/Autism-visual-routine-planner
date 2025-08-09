import { useState } from "react";
import {Input} from "./ui/input";
import {Button} from "./ui/button";

export default function AuthForm({onSubmit, loading, error, buttonText}){
    const [email, setEmail]= useState("");
    const [password, setPassword]=useState("");

    const handleSubmit = (e)=>{
        e.preventDefault();
        onSubmit(email, password);
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-4 w-full mx-auto">
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Loading..." : buttonText}
            </Button>

        </form>
    );

}