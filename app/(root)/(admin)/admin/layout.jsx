import AppSidebar from "@/components/Application/application/admin/AppSidebar";
import Topbar from "@/components/Application/application/admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { Children } from "react";

const layout = ({ children }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="border-b-blue-700 md:w-[calc(100vw-16rem)] ">
         <Topbar/>
          <div className=" px-5 mt-14 min-h-[calc(100vh-40px)]">
            
            {children}
            </div>

          <div className="border-t-2 h-[40px] flex justify-center bg-gray-100 dark:bg-background text-sm">
            <h1>@2025 All Right reserved by Arvind Kumar</h1>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default layout;
