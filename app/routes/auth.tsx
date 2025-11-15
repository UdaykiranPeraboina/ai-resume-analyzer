import { useLocation, useNavigate } from "react-router";
import React, { useEffect } from 'react';
import type { Route } from "./+types/auth";
import { usePuterStore } from '~/lib/puter';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Auth - Resubuild" },
    { name: "description", content: "Authenticate to access Resubuild features" },
  ];
}  

const auth = () => {
  const {isLoading, auth: authState} = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1] || '/';
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) navigate(next);
  }, [authState.isAuthenticated, next, navigate]);
       
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
         <div className='gradient-border shadow-lg'>
              <section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
                <div className='flex flex-col items-center gap-2 text-center'>
                    <h1>Welcome</h1>
                  <p>log in to continue your job journey</p>
                </div>
                <div>
                    {isLoading ?(
                         <button className="auth-button animate-pulse">
                            <p>Signing you in...</p>
                         </button>
                        
                    ): (
                        <>
                        {authState.isAuthenticated ? (
                            <button className="auth-button" onClick={authState.signOut}>
                                <p>Log Out</p>
                            </button>
                        ):(
                             <button className="auth-button" onClick={authState.signIn}>
                                <p>Log In</p>
                            </button>
                        )}
                        </>
                    )}
                </div>
                  
              </section>
         </div>
    </main>
  )
}

export default auth