"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { User } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AppSideBar from "@/components/custom/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ActionContext } from "@/context/ActionContext";
import { useRouter } from "next/navigation";
function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const [action, setAction] = useState(null);
  const convex = useConvex();
  const router =useRouter();
  useEffect(() => {
    IsAuthenticated();
  }, []);

 
  const IsAuthenticated = async () => {
    if (typeof window !== undefined) {
      const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      if (storedUser?._id) {
        const user = await convex.query(api.users.GetUser, {
          email: storedUser.email, // Optional but for validation
        });
        setUserDetail(user);
        console.log("User fetched:", user);
      }
    }
  };
  
    return (
      <div>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}
        >
          <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
          <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
              <SidebarProvider defaultOpen={false} className='flex flex-col'>

                <Header />
                {children}
                <div className="absolute">
                <AppSideBar/>
   
                </div>
           

                </SidebarProvider>
              </NextThemesProvider>
              </ActionContext.Provider>
            </MessagesContext.Provider>
          </UserDetailContext.Provider>
          </PayPalScriptProvider>
        </GoogleOAuthProvider>
        ;
      </div>
    );
}
export default Provider;
