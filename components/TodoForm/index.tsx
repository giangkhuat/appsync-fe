"use client";

import { createTodoAppsync } from "@/actions/appsync.actions";
import { useUserStore } from "@/store/userStore";
import { events } from "aws-amplify/data";
import { useState } from "react";
import { useTodoContext } from "@/context/TodoContext";
import { useChannel } from "@/context/ChannelContext";
import { removeDuplicateChannels } from "../BroadcastedTodos";

type CreateTodoInput = {
  UserID: string;
  title: string;
  channel?: string;
};

interface TodoFormProps {
  setShowTodoForm: (value: boolean) => void;
}

export default function TodoForm({ setShowTodoForm }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const { channels } = useChannel();
  const filteredChannels = removeDuplicateChannels(channels);
  const [selectedChannel, setSelectedChannel] = useState("");
  const { setPersonalTodos } = useTodoContext();
  const { sub } = useUserStore();

  const handlePublish = async (
    todo: string,
    channel: string,
    todoID: string
  ) => {
    try {
      await events.post(`/default/${channel}`, {
        todo,
        channel,
        userID: sub,
        todoID,
      });
    } catch (error) {
      console.log("error publishing =", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const submittedData: Record<string, string> = {};
    formData.forEach((value, key) => {
      submittedData[key] = value.toString();
    });

    const todoData: CreateTodoInput = {
      UserID: sub as string,
      title: submittedData.todo,
      channel: submittedData.channel?.length > 0 ? submittedData.channel : "",
    };

    if (
      selectedChannel &&
      submittedData.channel &&
      submittedData.channel.length !== 0
    ) {
      const res = await createTodoAppsync(todoData);
      handlePublish(submittedData.todo, submittedData.channel, res.TodoID);
      setShowTodoForm(false);
      return;
    }

    try {
      const res = await createTodoAppsync(todoData);
      const newTodo = {
        UserID: res.UserID,
        TodoID: res.TodoID,
        title: res.title,
        completed: res.completed,
        channel: res?.channel,
      };
      setPersonalTodos((prev) => [...prev, newTodo]);
    } catch (error) {
    } finally {
      setShowTodoForm(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Create a Todo
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Todo Input */}
          <div>
            <label
              htmlFor="todo"
              className="block text-sm font-medium text-gray-700"
            >
              Todo
            </label>
            <input
              type="text"
              name="todo"
              id="todo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Buy Groceries"
              required
            />
          </div>

          {/* Channel Dropdown */}
          <div>
            <label
              htmlFor="channel"
              className="block text-sm font-medium text-gray-700"
            >
              Workspace (Optional)
            </label>
            <select
              id="channel"
              name="channel"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">None</option>
              {filteredChannels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowTodoForm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
