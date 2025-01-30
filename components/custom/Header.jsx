import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActionContext } from "@/context/ActionContext";
import { LucideDownload, Rocket, LogOut } from "lucide-react";
import SignInDialog from "./SignInDialog";
import Logo from "/public/design.jpg";
function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext) || {};
  const [openDialog, setOpenDialog] = useState(false); // State to toggle sign-in dialog
  const path = usePathname();

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  const handleSignOut = () => {
    // Clear user details from context
    setUserDetail(null);
    // Optionally, you can also clear user data from localStorage or cookies
    localStorage.removeItem("userDetail"); // Example: Clear localStorage
  };

  return (
    <>
      {/* Header Content */}
      <div className="p-4 flex justify-between items-center border-b">
        {/* Logo */}
        <Link href={"/"}>
          <Image src={Logo} alt="logo" width={40} height={40} />
        </Link>

        {/* Buttons for Sign In / Get Started or Workspace Actions */}
        {!userDetail?.name ? (
          <div className="flex gap-5">
            {/* Sign In Button */}
            <Button onClick={() => setOpenDialog(true)} variant="ghost">
              Sign In
            </Button>

            {/* Get Started Button */}
            <Button
              onClick={() => setOpenDialog(true)}
              className="text-white"
              style={{
                backgroundColor: Colors.BLUE,
              }}
            >
              Get Started
            </Button>
          </div>
        ) : (
          // Workspace Buttons or Sign Out Button
          <div className="flex gap-2 items-center">
            {path?.includes("workspace") ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onActionBtn("export")}
                  className="flex items-center gap-1"
                >
                  <LucideDownload /> Export
                </Button>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1 px-4 py-2 rounded-md"
                  onClick={() => onActionBtn("deploy")}
                >
                  <Rocket /> Deploy
                </Button>
              </>
            ) : (
              // Sign Out Button (when not in workspace)
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center gap-1"
              >
                <LogOut /> Sign Out
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Sign-In Dialog */}
      <SignInDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </>
  );
}

export default Header;