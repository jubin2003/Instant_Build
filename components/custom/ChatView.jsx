"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import * as Toast from "@radix-ui/react-toast";
import { useSidebar } from "../ui/sidebar";

export const countToken = (inputText) => {
  return inputText.trim().split(/\s+/).filter((word) => word).length;
};

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();
  const UpdateTokens = useMutation(api.users.UpdateToken);

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(Array.isArray(result?.messages) ? result.messages : []);
    console.log("Workspace data:", result);
  };

  useEffect(() => {
    if (!Array.isArray(messages)) setMessages([]);
  }, [messages]);

  
  const GetAiResponse = async () => {
    try {
      setLoading(true);
  
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });
      const aiResp = { role: "ai", content: result.data.result };
  
      setMessages((prev) => [...prev, aiResp]);
      await UpdateMessages({ messages: [...messages, aiResp], workspaceId: id });
  
      // Token Deduction
      const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
     
    // Add this right after token calculation
if (isNaN(token) || token < 0) {
  setToastMessage("Not enough tokens available!");
  setToastOpen(true);
  return;
}
setUserDetail((prev) => ({ ...prev, token: token }));
      await UpdateTokens({ userId: userDetail?._id, token: token });
  
    } catch (error) {
      console.error("Error in GetAiResponse:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GetAiResponse();
      }
    }
  }, [messages]);

  const onGenerate = (input) => {
    if (userDetail?.token < 10) {
      setToastMessage("You don't have enough tokens! Please purchase more.");
      setToastOpen(true); // Show toast
      return;
    }
    if (userDetail?.token < 5000) {
      setToastMessage("You don't have enough tokens! Please purchase more.");
      setToastOpen(true);
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide px-5">
        {Array.isArray(messages) &&
          messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            >
              {msg.role === "user" && (
                <Image
                  src={userDetail?.picture || "/default-user.png"}
                  alt="user-image"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <ReactMarkdown className="flex flex-col">{msg.content}</ReactMarkdown>
            </div>
          ))}
        {loading && (
          <div
            className="p-5 border rounded-xl max-w-xl w-full mt-3"
            style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating Response...</h2>
          </div>
        )}
      </div>

      {userDetail ? (
        <div className="flex gap-2 items-end">
          <Image
            src={userDetail.picture}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
            alt="user-profile"
            width={30}
            height={30}
          />
          <div
            className="p-5 border rounded-xl max-w-xl w-full mt-3"
            style={{
              backgroundColor: Colors.BACKGROUND,
            }}
          >
            <div className="flex gap-2">
              <textarea
                value={userInput}
                className="outline-none bg-transparent w-full h-32 max-h-50"
                placeholder={Lookup.INPUT_PLACEHOLDER}
                onChange={(event) => setUserInput(event.target.value)}
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
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Please log in to start chatting.</p>
      )}

      {/* Toast */}
      {userDetail?.token < 10 && (
  <Toast.Provider swipeDirection="right">
    <Toast.Root
      className="bg-black text-white p-4 rounded-md shadow-md"
      open={toastOpen}
      onOpenChange={setToastOpen}
    >
      <Toast.Title className="font-bold">Notification</Toast.Title>
      <Toast.Description>You don’t have enough tokens! Please purchase more.</Toast.Description>
    </Toast.Root>
    <Toast.Viewport className="fixed bottom-5 right-5 z-50" />
  </Toast.Provider>
)}


    </div>
  );
}

export default ChatView;
