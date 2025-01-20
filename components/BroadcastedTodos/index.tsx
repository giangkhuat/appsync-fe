import React, { useEffect, useState } from "react";
import { useChannel } from "@/context/ChannelContext";
import Edit from "./Edit";
import { listAllTodosAppsync } from "@/actions/appsync.actions";
import useSWR from "swr";
import { useSharedTodoContext } from "@/context/SharedTodoContext";
import { useUserStore } from "@/store/userStore";

interface BroadcastedTodo {
  UserID: string;
  TodoID: string;
  title: string;
  completed: boolean;
  channel?: string; // Channel is optional
}

type EditButtonProps = {
  userID: string;
  todoID: string;
};

const BroadcastedTodos: React.FC = () => {
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const { sharedTodos, setSharedTodos } = useSharedTodoContext();
  const { data, error } = useSWR("listAllTodos", () =>
    listAllTodosAppsync()
  ) as any;

  const { broadcastedTodos }: { broadcastedTodos: BroadcastedTodo[] } =
    useChannel();

  useEffect(() => {
    if (data) {
      setSharedTodos(data || []);
    }
  }, [data]);

  const handleEdit = (todoId: string) => {
    setEditTodoId(todoId);
  };

  const handleCancelEdit = () => {
    setEditTodoId(null);
  };

  const allTodos = sharedTodos
    ? [...sharedTodos, ...broadcastedTodos]
    : broadcastedTodos;
  console.log("all to dos = ", allTodos);
  // Group todos by channel
  const groupedTodos: Record<string, BroadcastedTodo[]> = allTodos.reduce(
    (acc: Record<string, BroadcastedTodo[]>, todo: BroadcastedTodo) => {
      // Only include todos with a non-empty channel (excluding empty string)
      if (todo.channel && todo.channel.length > 0) {
        const channel = todo.channel;
        if (!acc[channel]) acc[channel] = [];
        acc[channel].push(todo);
      }
      return acc;
    },
    {}
  );
  const EditButton: React.FC<EditButtonProps> = ({ userID, todoID }) => {
    const { sub } = useUserStore();
    if (userID === sub) {
      return (
        <button
          onClick={() => {
            handleEdit(todoID);
          }}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
      );
    }
    return <></>;
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
      <h4 className="text-lg font-semibold text-gray-700 mb-4">Shared</h4>
      {Object.keys(groupedTodos).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTodos).map(([channel, todos]) => (
            <div
              key={channel}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              {/* Channel Header */}
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-indigo-600">
                  {channel}
                </h5>
                <span className="text-gray-500 text-xs italic">
                  {todos.length} {todos.length > 1 ? "todos" : "todo"}
                </span>
              </div>

              {/* Todo List */}
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.TodoID}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3 hover:bg-gray-100 transition"
                  >
                    {/* Title and Status */}
                    <div className="flex items-center">
                      {/* Status Icon */}
                      {todo.completed ? (
                        <span className="text-green-600 text-sm font-semibold mr-3">
                          ✔
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm font-semibold mr-3">
                          ✘
                        </span>
                      )}
                      {/* Title */}
                      <div>
                        <h6 className="text-sm font-medium text-gray-800 truncate">
                          {todo.title}
                        </h6>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <div>
                      {editTodoId === todo.TodoID ? (
                        <>
                          <button
                            onClick={handleCancelEdit}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            Cancel
                          </button>
                          <Edit title={todo.title} todoId={todo.TodoID} />
                        </>
                      ) : (
                        <EditButton userID={todo.UserID} todoID={todo.TodoID} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No shared Todos</p>
      )}
    </div>
  );
};

export default BroadcastedTodos;
