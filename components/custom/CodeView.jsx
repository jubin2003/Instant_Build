
"use client"; // Mark this component as a Client Component
// import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import { MessagesContext } from "@/context/MessagesContext";
import axios from "axios";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { countToken } from "./ChatView";
import { UserDetailContext } from "@/context/UserDetailContext";
import { ActionContext } from "@/context/ActionContext";

const SandpackPreviewClient = dynamic(() => import('./SandpackPreviewClient'), {
  ssr: false,
});

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(null); // Initialize with null
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const UpdateTokens = useMutation(api.users.UpdateToken);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { action, setAction } = useContext(ActionContext);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      GetFiles();
    }
  }, [id]);

  useEffect(() => {
    if (messages?.length > 0) {
      const lastRole = messages[messages?.length - 1]?.role;
      if (lastRole === "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GetFiles = async () => {
    try {
      setLoading(true);
      const result = await convex.query(api.workspace.GetWorkspace, { workspaceId: id });
      setFiles({ ...Lookup.DEFAULT_FILE, ...result?.fileData }); // Set files when data is ready
    } catch (error) {
      console.error("Error fetching workspace files:", error);
    } finally {
      setLoading(false);
    }
  };

  const GenerateAiCode = async () => {
    try {
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post("/api/gen-ai-code", { prompt: PROMPT });
      const aiResp = result.data;

      // Ensure aiResp.files is defined
      if (!aiResp?.files) {
        throw new Error("AI response does not contain files.");
      }

      const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files };
      setFiles(mergedFiles);

      await UpdateFiles({
        workspaceId: id,
        files: aiResp.files,
      });

      setActiveTab("code");
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure Sandpack only renders when files are available
  if (!files) {
    return <div>Loading...</div>; // Render loading state until files are available
  }

  return (
    <div className="relative">
      <div className="bg-[#181818]  w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 justify-center w-[140px] gap-3 rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab === "code" ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full" : ""}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab === "preview" ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full" : ""}`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: { ...Lookup.DEPENDANCY }
        }}
        options={{
          externalResources: ['https://cdn.tailwindcss.com']
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <SandpackPreviewClient />
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-10 bg-gray-900 opacity-90 absolute top-0 rounded-lg w-full h-full flex items-center justify-center ">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files .....</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;