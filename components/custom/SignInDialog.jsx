import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { FcGoogle } from "react-icons/fc";



function SignInDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api?.users?.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
      );

      console.log(userInfo);
      const user = userInfo.data;
      const userId = await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid: uuid4(),
      });

      const userWithId = { ...user, _id: userId };
      if (typeof window !== undefined) {
        localStorage.setItem("user", JSON.stringify(userWithId));
      }

      setUserDetail(userWithId);
      closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg">
          <DialogHeader className="text-center">
            {/* Hidden DialogTitle for Accessibility */}
            <DialogTitle>
              <VisuallyHidden>Sign In</VisuallyHidden>
            </DialogTitle>
            <div className="text-sm">
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="font-extrabold text-center text-2xl text-white">
                  {Lookup.SIGNIN_HEADING}
                </h2>
                {/* <p className="mt-2 text-center text-gray-400">
                  {Lookup.SIGNIN_SUBHEADING}
                </p> */}
                <DialogDescription className="text-gray-400">
                  Use Google to sign in and access your account.
                </DialogDescription>
                <Button
                  onClick={googleLogin}
                  className="bg-blue-500 text-white hover:bg-blue-400 focus:ring focus:ring-blue-300 transition-all py-2 px-4 rounded-lg shadow-sm mt-4 flex items-center gap-2"
                >
                  <FcGoogle size={20} /> Sign In with Google
                </Button>
                <span className="text-gray-400 text-center text-sm font-medium">
                  {Lookup?.SIGNIn_AGREEMENT_TEXT}
                </span>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SignInDialog;
