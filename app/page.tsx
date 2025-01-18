"use client";
import NavBar from "@/components/NavBar";
import Todos from "@/components/Todos";
import { ChannelProvider } from "@/context/ChannelContext";

import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
function Page() {
  const { fetchUsername } = useUserStore();

  useEffect(() => {
    fetchUsername();
  }, []);
  return (
    <ChannelProvider>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <NavBar />
        <Todos />
      </div>
    </ChannelProvider>
  );
}

export default Page;
