import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
function SideBarFooter() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext); // Access the context to update user details
  const { toggleSidebar } = useSidebar();
  const handleLogout = () => {
    // Clear user session from context and localStorage
    setUserDetail(null); // Clear user detail in context
    localStorage.removeItem("user"); // Optional: Clear stored token if using localStorage
    toggleSidebar();
    // Redirect user to the login page
    router.push("/");
  };

  const options = [
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Help Center",
      icon: HelpCircle,
    },
    {
      name: "My Subscription",
      icon: Wallet,
      path: "/pricing",
    },
    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];

  const onOptionClick = (option) => {
    if (option.name === "Sign Out") {
      handleLogout(); // Call the logout function for Sign Out
    } else if (option.path) {
      router.push(option.path); // Navigate to the specified path
    }
  };

  return (
    <div className="p-5 mb-10">
      {options.map((option, index) => (
        <Button
          onClick={() => onOptionClick(option)}
          variant="ghost"
          className="w-full flex justify-start my-3"
          key={index}
        >
          <option.icon />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
