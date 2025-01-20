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
    <div className="space-y-6">
      <h4 className="text-center text-xl font-bold mb-3">Broadcasted Todos</h4>
      {Object.keys(groupedTodos).length > 0 ? (
        Object.entries(groupedTodos).map(([channel, todos]) => (
          <div
            key={channel}
            className="border border-gray-300 rounded-lg shadow-md p-4 space-y-2 max-h-56 overflow-y-auto"
          >
            <h5 className="text-md font-semibold text-indigo-600 mb-2">
              Channel: {channel}
            </h5>
            <div className="space-y-2">
              {todos.map((todo: BroadcastedTodo) => (
                <div
                  key={todo.TodoID}
                  className="bg-gray-100 border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition duration-200"
                >
                  <h6 className="text-sm font-semibold text-gray-800">
                    {todo.title}
                  </h6>
                  <p className="text-xs text-gray-500">
                    Status:{" "}
                    {todo.completed ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Incomplete
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <h4 className="text-center text-gray-600">No Broadcasted Todos</h4>
      )}
    </div>
  );
};

export default BroadcastedTodos;
