import React, { useEffect, useRef, useState } from "react";
import Table from "./Table";
import { createTodoAppsync, listTodosAppsync } from "@/actions/appsync.actions";
import { getUserName, useUserStore } from "@/store/userStore";
import { events, EventsChannel } from "aws-amplify/data";
import useSWR from "swr";
import { Button } from "../ui/button";
import { config } from "../../ConfigureAmplifyClientSide";
import { Amplify } from "aws-amplify";

/**
 *
 * @returns
 *
 * Now I have a react app with
 * 1 mutation to create 1 to do
 * 1 query to get all the to do items
 *
 * the queries and mutations are handled by appsync and lambda.
 *
 * Now I want a simplest feature (anything to use real time feature of appsync )
 * what do you recommend me to do ? least effort possible
 *
 * 1. Functionality user to subscribe to a channel first
 * 4. Add to do to that channel
 * 5. broadcast to the client subscribed to it (myself)
 * 6. add that item to dynamodb (durable storage)
 *
 * Later
 * - Specify a channel to be added to
 */

Amplify.configure(config);

const Todos = () => {
  const { sub } = useUserStore();
  const channelRef = useRef<EventsChannel | null>(null);
  const [space, setSpace] = useState("");
  const [todos, setTodos] = useState([]);
  const { data, error } = useSWR(sub ? ["todos", sub] : null, () =>
    listTodosAppsync(sub as string)
  ) as any;

  useEffect(() => {
    if (data) {
      setTodos(data); // Initialize todos when fetched from API
    }
  }, [data]);

  const handlePublish = async () => {
    await events.post("/default/leaderboard", {
      todo: "buy shampoo",
    });
  };

  useEffect(() => {
    if (!space || !space.length) {
      return;
    }

    const channelConnect = async () => {
      console.log("subscribe to a channel");
      try {
        const channel = await events.connect(`/default/${space}`);
        channelRef.current = channel;

        channel.subscribe({
          next: handleNewData,
          error: (err: any) => console.log(err),
        });
      } catch (e) {
        console.log("Error connecting to channel: ", e);
      }
    };

    const handleNewData = async (data: any) => {
      console.log("data =", data?.event);
      const todo = data.event.todo;
      const id = data.id;
      const item = {
        UserID: "123",
        TodoID: id,
        title: todo,
        completed: false,
      };
      console.log("item =", item);
      setTodos((prevTodos) => [...prevTodos, item]); // Correctly update state
      console.log("todos = ", todos);
      const user = await getUserName();
      console.log("user =", user);
      try {
        const res = await createTodoAppsync({
          UserID: user.userID,
          title: todo,
        }); // Call the API to persist the new todo
        console.log("Todo persisted to DynamoDB successfully., res =", res);
      } catch (error) {
        console.error("Failed to persist todo:", error);
      }
    };

    channelConnect();

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [space]);

  if (!sub) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Error occurred while fetching todos</div>;
  }

  if (!todos || todos.length === 0) {
    return <h4 className="text-center mt-5">Create Todo's</h4>;
  }

  return (
    <div>
      <Button onClick={handlePublish} className="mb-4">
        Add to do
      </Button>
      <Button
        onClick={() => {
          setSpace("leaderboard");
        }}
        className="mb-4"
      >
        Join space
      </Button>
      <Table data={todos as any} />
    </div>
  );
};

export default Todos;
