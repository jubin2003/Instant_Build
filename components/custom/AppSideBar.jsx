import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChartBarIcon, MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./WorkspaceHistory";
import SideBarFooter from "./SideBarFooter";
import { useRouter } from "next/navigation"; 

function AppSideBar() {
  const router = useRouter(); // Initialize the router
  const handleStartNewChat = () => {
    router.push("/"); // Navigate to the home page
  };
  return (
    <div>
      <Sidebar>
        <SidebarHeader className="p-5">
          <Image  src="/design.jpg" alt="logo" width={30} height={30} />
          <Button className='mt-5' onClick={handleStartNewChat}>
            <MessageCircleCode />
            Start New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent className="p-5">
          
          <SidebarGroup />
          <WorkspaceHistory />
          {/* <SidebarGroup /> */}
        </SidebarContent>
        <SidebarFooter>
          <SideBarFooter />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default AppSideBar;
