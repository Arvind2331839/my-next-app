import React from "react";
import UserDropdown from "./UserDropdown";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="fixed border h-14 w-full md:w-[calc(100vw-16rem)] top-0   z-30 md:ps-60 flex justify-between items-center bg-amber-50 dark:bg-card">
      <div>HEADER</div>
      <div className=" flex mr-5">
       <ThemeSwitch />
        <UserDropdown />
        <Button>
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
