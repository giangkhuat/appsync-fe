import React, { useEffect, useState } from "react";
import Table from "./Table";
import { listTodosAppsync } from "@/actions/appsync.actions";
import { useUserStore } from "@/store/userStore";
import useSWR from "swr";
import { config } from "../../ConfigureAmplifyClientSide";
import { Amplify } from "aws-amplify";
import { useTodoContext } from "@/context/TodoContext";

Amplify.configure(config);

export interface PersonalTodo {
  UserID: string;
  TodoID: string;
  title: string;
  completed: boolean;
  channel?: string;
}

const Todos = () => {
  const { sub } = useUserStore();

  const { personalTodos, setPersonalTodos } = useTodoContext();
  const { data, error } = useSWR(sub ? ["todos", sub] : null, () =>
    listTodosAppsync(sub as string)
  ) as any;

  useEffect(() => {
    if (data) {
      setPersonalTodos(data || []);
    }
  }, [data]);

  if (!sub) {
    return <></>;
  }

  if (error) {
    return <div>Error occurred while fetching todos</div>;
  }

  const filteredData = personalTodos.filter(
    (todo) =>
      (!todo.channel || todo.channel.trim() === "") && todo.UserID === sub
  );

  const incompleteCount = filteredData.filter((todo) => !todo.completed).length;
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-700">Personal</h4>
        {filteredData.length > 0 && (
          <p className="text-sm text-gray-500 italic">
            {incompleteCount} {incompleteCount === 1 ? "todo" : "todos"}
          </p>
        )}
      </div>
      {filteredData && filteredData.length > 0 ? (
        <Table data={filteredData} />
      ) : (
        <p className="text-sm text-gray-600">No Personal Todos</p>
      )}
    </div>
  );
};

export default Todos;
