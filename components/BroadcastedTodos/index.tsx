import React from "react";
import { useChannel } from "@/context/ChannelContext";

interface BroadcastedTodo {
  UserID: string;
  TodoID: string;
  title: string;
  completed: boolean;
  channel?: string; // Channel is optional
}

const BroadcastedTodos: React.FC = () => {
  const { broadcastedTodos }: { broadcastedTodos: BroadcastedTodo[] } =
    useChannel();

  // Group todos by channel
  const groupedTodos: Record<string, BroadcastedTodo[]> =
    broadcastedTodos.reduce(
      (acc: Record<string, BroadcastedTodo[]>, todo: BroadcastedTodo) => {
        const channel = todo.channel || "Unknown Channel";
        if (!acc[channel]) acc[channel] = [];
        acc[channel].push(todo);
        return acc;
      },
      {}
    );

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
      <h4 className="text-lg font-semibold text-gray-700 mb-4">
        Broadcasted Todos
      </h4>
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
                {todos.map((todo: BroadcastedTodo) => (
                  <div
                    key={todo.TodoID}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center">
                      {/* Radio Button */}
                      <input
                        type="radio"
                        name={`todo-${channel}`}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        checked={todo.completed}
                        readOnly
                      />
                      <div className="ml-3">
                        <h6 className="text-sm font-medium text-gray-800">
                          {todo.title}
                        </h6>
                        <p className="text-xs text-gray-500">
                          {todo.completed ? "Completed" : "Incomplete"}
                        </p>
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div>
                      {todo.completed ? (
                        <span className="text-green-600 text-sm font-semibold">
                          ✔
                        </span>
                      ) : (
                        <span className="text-red-600 text-sm font-semibold">
                          ✘
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No Broadcasted Todos</p>
      )}
    </div>
  );
};

export default BroadcastedTodos;
