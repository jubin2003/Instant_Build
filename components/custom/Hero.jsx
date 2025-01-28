"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React, { useContext, useState } from "react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import * as Toast from "@radix-ui/react-toast";
function Hero() {
  const [userInput, setUserInput] = useState();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();
const [toastOpen, setToastOpen] = useState(false);
 const [toastMessage, setToastMessage] = useState("");
// }
const onGenerate = async (input) => {
  if (!userDetail?._id) {
    setOpenDialog(true);
    return;
  }
  if(userDetail?.token<10){
    setToastMessage("You don't have enough tokens! Please purchase more.");
    setToastOpen(true);
    return;
  }
  const msg = {
    role: "user",
    content: input,
  };

  setMessages(msg);
  const workspaceId = await CreateWorkspace({
    user: userDetail._id, // Use the user's `_id`.
    messages: [msg],
  });
  console.log(workspaceId);
  router.push("/workspace/" + workspaceId);
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 lg:px-16">
    <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
      <h2 className="font-bold text-4xl text-center">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-500 font-medium text-center">{Lookup.HERO_DESC}</p>
      <div
        className="p-5 border rounded-xl w-full max-w-2xl mt-3"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <div className="flex gap-2">
          <textarea
            className="outline-none bg-transparent w-full h-32 max-h-50 resize-none"
            placeholder={Lookup.INPUT_PLACEHOLDER}
            onChange={(event) => setUserInput(event.target.value.trim())}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              onKeyDown={(e) => e.key === "Enter" && onGenerate(userInput)}
              tabIndex={0}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl justify-center gap-3">
        {Lookup.SUGGSTIONS.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => onGenerate(suggestion)}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
     <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="bg-red-500 text-white p-4 rounded-md shadow-md"
        open={toastOpen}
        onOpenChange={setToastOpen}
      >
        <Toast.Title className="font-bold">Notification</Toast.Title>
        <Toast.Description>{toastMessage}
          
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-5 right-5 z-50" />
    </Toast.Provider>
  </div>
  
  );
}

export default Hero;
