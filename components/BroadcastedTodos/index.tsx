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

export const removeDuplicateChannels = (strings: string[]): string[] => {
  return Array.from(new Set(strings));
};

const getChannels = (todos: BroadcastedTodo[]): string[] => {
  const channels = todos
    .map((todo) => todo.channel)
    .filter((channel): channel is string => !!channel); // Filter out undefined or null values
  return Array.from(new Set(channels));
};

const removeDuplicates = (todos: BroadcastedTodo[]): BroadcastedTodo[] => {
  const seenTodoIDs = new Set<string>();
  return todos.filter((todo) => {
    if (seenTodoIDs.has(todo.TodoID)) {
      return false; // Skip duplicate
    }
    seenTodoIDs.add(todo.TodoID); // Mark as seen
    return true; // Include in the result
  });
};

const BroadcastedTodos: React.FC = () => {
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const { sharedTodos, setSharedTodos } = useSharedTodoContext();
  const { subscribeToChannel } = useChannel();
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

  const removeDuplicatesTodo = removeDuplicates(allTodos);
  const uniqueChannels = removeDuplicateChannels(
    getChannels(removeDuplicatesTodo)
  );

  uniqueChannels.forEach((channel) => subscribeToChannel(channel));

  // Group todos by channel
  const groupedTodos: Record<string, BroadcastedTodo[]> =
    removeDuplicatesTodo.reduce(
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
          onClick={() => handleEdit(todoID)}
          className="text-gray-600 hover:text-gray-800"
          aria-label="Edit"
        >
          {/* Pencil Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
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
                    className="flex items-center bg-white border border-gray-200 rounded-md p-3 shadow-sm hover:bg-gray-50 transition"
                  >
                    {/* Status Icon */}
                    <div className="flex-none mr-3">
                      {todo.completed ? (
                        <span className="text-green-500 text-xl font-bold">
                          ✔
                        </span>
                      ) : (
                        <span className="text-red-500 text-xl font-bold">
                          ✘
                        </span>
                      )}
                    </div>

                    {/* Main Todo Content */}
                    <div className="flex-grow">
                      {/* TodoID as Badge */}
                      <div className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 rounded-md px-2 py-1">
                        {todo.TodoID.toUpperCase()}
                      </div>
                      {/* Todo Title */}
                      <div className="text-sm font-medium text-gray-800 truncate mt-1">
                        {todo.title}
                      </div>
                    </div>

                    {/* Edit Icon */}
                    <div className="flex-none">
                      {editTodoId === todo.TodoID ? (
                        <>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-800 text-xs font-medium mr-2"
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

  // return (
  //   <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
  //     <h4 className="text-lg font-semibold text-gray-700 mb-4">Shared</h4>
  //     {Object.keys(groupedTodos).length > 0 ? (
  //       <div className="space-y-6">
  //         {Object.entries(groupedTodos).map(([channel, todos]) => (
  //           <div
  //             key={channel}
  //             className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
  //           >
  //             {/* Channel Header */}
  //             <div className="flex items-center justify-between mb-3">
  //               <h5 className="text-sm font-semibold text-indigo-600">
  //                 {channel}
  //               </h5>
  //               <span className="text-gray-500 text-xs italic">
  //                 {todos.length} {todos.length > 1 ? "todos" : "todo"}
  //               </span>
  //             </div>

  //             {/* Todo List */}
  //             <div className="space-y-3">
  //               {todos.map((todo) => (
  //                 <div
  //                   key={todo.TodoID}
  //                   className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3 hover:bg-gray-100 transition"
  //                 >
  //                   {/* Title and Status */}
  //                   <div className="flex items-center">
  //                     {/* Status Icon */}
  //                     {todo.completed ? (
  //                       <span className="text-green-600 text-sm font-semibold mr-3">
  //                         ✔
  //                       </span>
  //                     ) : (
  //                       <span className="text-red-600 text-sm font-semibold mr-3">
  //                         ✘
  //                       </span>
  //                     )}
  //                     {/* Title */}
  //                     <div>
  //                       <h6 className="text-sm font-medium text-gray-800 truncate">
  //                         {todo.title}
  //                       </h6>
  //                     </div>
  //                   </div>

  //                   {/* Edit Button */}
  //                   <div>
  //                     {editTodoId === todo.TodoID ? (
  //                       <>
  //                         <button
  //                           onClick={handleCancelEdit}
  //                           className="text-indigo-600 hover:text-indigo-900 mr-2"
  //                         >
  //                           Cancel
  //                         </button>
  //                         <Edit title={todo.title} todoId={todo.TodoID} />
  //                       </>
  //                     ) : (
  //                       <EditButton userID={todo.UserID} todoID={todo.TodoID} />
  //                     )}
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     ) : (
  //       <p className="text-sm text-gray-600">No shared Todos</p>
  //     )}
  //   </div>
  // );
};

export default BroadcastedTodos;
