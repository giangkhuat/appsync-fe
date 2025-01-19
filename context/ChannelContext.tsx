import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { events } from "aws-amplify/api";

// Define the shape of the context
interface ChannelContextType {
  channel: string | null;
  broadcastedTodos: Array<{
    UserID: string;
    TodoID: string;
    title: string;
    completed: boolean;
  }>;
  subscribeToChannel: (channelName: string) => Promise<void>;
}

// Create the context with the correct type
const ChannelContext = createContext<ChannelContextType | null>(null);

export const ChannelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [channel, setChannel] = useState<string | null>(null);
  const [broadcastedTodos, setBroadcastedTodos] = useState<
    ChannelContextType["broadcastedTodos"]
  >([]);
  const channelRef = useRef<any>(null);

  const subscribeToChannel = async (channelName: string) => {
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

  const handleNewData = (data: any) => {
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

// Hook to consume the context
export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error("useChannel must be used within a ChannelProvider");
  }
  return context;
};
