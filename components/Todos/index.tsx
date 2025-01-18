import React, { useEffect, useRef, useState } from "react";
import Table from "./Table";
import { createTodoAppsync, listTodosAppsync } from "@/actions/appsync.actions";
import { getUserName, useUserStore } from "@/store/userStore";
import { events, EventsChannel } from "aws-amplify/data";
import useSWR from "swr";
import { Button } from "../ui/button";
import { config } from "../../ConfigureAmplifyClientSide";
import { Amplify } from "aws-amplify";
import { useChannel } from "@/context/ChannelContext";

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
 * 8. add that item to
 *
 * Later
 * - Specify a channel to be added to
 *
 *
 *
 * Experience:
 * diffeerent workchannels to do:
 * - Personal
 *
 */

Amplify.configure(config);

const Todos = () => {
  const { sub } = useUserStore();
  const { broadcastedTodos } = useChannel();
  const [personalTodos, setPersonalTodos] = useState([]);
  const { data, error } = useSWR(sub ? ["todos", sub] : null, () =>
    listTodosAppsync(sub as string)
  ) as any;

  console.log("broadcasted to dos =", broadcastedTodos);
  useEffect(() => {
    if (data) {
      setPersonalTodos(data || []);
    }
  }, [data]);

  if (!sub) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Error occurred while fetching todos</div>;
  }

  if (!personalTodos || personalTodos.length === 0) {
    return <h4 className="text-center mt-5">Create Todo's</h4>;
  }

  return (
    <div>
      <Table data={broadcastedTodos as any} />
      <Table data={personalTodos as any} />
    </div>
  );
};

export default Todos;
