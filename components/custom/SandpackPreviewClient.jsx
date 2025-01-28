import { ActionContext } from "@/context/ActionContext";
import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import React, { useContext, useEffect, useRef } from "react";

function SandpackPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    if (sandpack && action) {
      initializeClient();
    }
  }, [sandpack, action]);

  const initializeClient = async () => {
    try {
      const client = previewRef.current?.getClient();
      if (client) {
        const result = await client.getCodeSandboxURL();
        console.log(result);

        if (action?.actionType === "deploy") {
          window?.open('https://'+result?.sandboxId+'.csb.app/');
        } else if (action?.actionType === "export") {
          window?.open('https://codesandbox.io/s/'+result?.sandboxId);
        }

        // Reset action to avoid repeated triggers
        setAction(null);
      }
    } catch (error) {
      console.error("Failed to initialize Sandpack client:", error);
    }
  };

  return (
    <div className="w-full">
      <SandpackPreview ref={previewRef} style={{ height: "80vh" }} showNavigator />
    </div>
  );
}

export default SandpackPreviewClient;
