import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "@/components/ui/collapsible";
import React from "react";
import logoBlack from "@/public/assets/images/logo-black.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const AppSidebar = () => {
  return (
    <Sidebar className='z-50'>
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center px-4">
          <Image
            src={logoBlack.src}
            height={50}
            width={50}
            alt="Logo"
            className="block dark:hidden h-[50px] w-auto"
          />
          <Button type="button" size="icon">
            ✕
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="group/collapsible">
                  <SidebarMenuButton asChild>
                    <Link href={menu?.url} className="flex items-center gap-2">
                      <menu.icon />
                      {menu.title}
                      {menu.submenu?.length > 0 && (
                       <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {menu.submenu?.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((sub, subIndex) => (
                        <SidebarMenuSubItem key={subIndex}>
                          <SidebarMenuSubButton asChild>
                            <Link href={sub.url}>{sub.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
