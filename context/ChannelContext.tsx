import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { events } from "aws-amplify/api";

const ChannelContext = createContext(null);

export const ChannelProvider = ({ children }) => {
  const [channel, setChannel] = useState(null);
  const [broadcastedTodos, setBroadcastedTodos] = useState([]);
  const channelRef = useRef(null);

  const subscribeToChannel = async (channelName) => {
    if (!channelName) return;

    setChannel(channelName);
    try {
      const topic = await events.connect(`/default/${channelName}`);
      channelRef.current = topic;

      topic.subscribe({
        next: handleNewData,
        error: (err) => console.error("Subscription error:", err),
      });
      console.log("subscribed to channel ", channelName);
    } catch (error) {
      console.error("Error subscribing to channel:", error);
    }
  };

  const handleNewData = (data) => {
    /**
     {
    "id": "c312f551-8b8d-4c62-8075-9a57e8e1edc8",
    "type": "data",
    "event": {
        "todo": "buy shampoo"
    }
}
     */
    console.log("handle new data is called, data =", data);
    const todo = data?.event?.todo;
    const id = data?.id;

    if (todo && id) {
      const newTodo = {
        UserID: "broadcast",
        TodoID: id,
        title: todo,
        completed: false,
      };
      setBroadcastedTodos((prev) => [...prev, newTodo]);
    }
  };

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  return (
    <ChannelContext.Provider
      value={{ channel, broadcastedTodos, subscribeToChannel }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => useContext(ChannelContext);
