"use client";
import BroadcastedTodos from "@/components/BroadcastedTodos";
import NavBar from "@/components/NavBar";
import Todos from "@/components/Todos";
import { ChannelProvider } from "@/context/ChannelContext";
import { SharedTodoProvider } from "@/context/SharedTodoContext";
import { TodoProvider } from "@/context/TodoContext";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
function Page() {
  const { fetchUsername } = useUserStore();

  useEffect(() => {
    fetchUsername();
  }, []);
  return (
    <ChannelProvider>
      <SharedTodoProvider>
        <TodoProvider>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <NavBar />
            <BroadcastedTodos />
            <Todos />
          </div>
        </TodoProvider>
      </SharedTodoProvider>
    </ChannelProvider>
  );
}

export default Page;
