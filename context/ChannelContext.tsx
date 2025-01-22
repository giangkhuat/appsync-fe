import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { events } from "aws-amplify/api";

interface Todo {
  UserID: string;
  TodoID: string;
  title: string;
  completed: boolean;
}

interface ChannelContextType {
  channels: string[]; // List of channels with todos
  broadcastedTodos: Todo[]; // Aggregated todos from all channels
  subscribeToChannel: (channelName: string) => Promise<void>;
}

function isChannelExisted(channel: string, channels: string[]): boolean {
  return channels.includes(channel);
}

// Create the context with the correct type
const ChannelContext = createContext<ChannelContextType | null>(null);

export const ChannelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [channels, setChannels] = useState<string[]>([]);
  const [broadcastedTodos, setBroadcastedTodos] = useState<
    ChannelContextType["broadcastedTodos"]
  >([]);
  const channelRefs = useRef<Map<string, any>>(new Map());

  const subscribeToChannel = async (channelName: string) => {
    if (!channelName || channelRefs.current.has(channelName)) return;

    try {
      const topic = await events.connect(`/default/${channelName}`);
      channelRefs.current.set(channelName, topic);

      topic.subscribe({
        next: (data) => handleNewData(data),
        error: (err) =>
          console.error(`Subscription error for ${channelName}:`, err),
      });

      if (!isChannelExisted(channelName, channels)) {
        setChannels((prev) => [...prev, channelName]);
      }

      console.log(`Subscribed to channel: ${channelName}`);
    } catch (error) {
      console.error(`Error subscribing to channel ${channelName}:`, error);
    }
  };
  const handleNewData = (data: any) => {
    const todo = data?.event?.todo;
    const channel = data?.event?.channel;
    if (todo && data?.event.todoID) {
      const newTodo: any = {
        UserID: data?.event.userID,
        TodoID: data?.event.todoID,
        title: todo,
        completed: false,
        channel,
      };

      setBroadcastedTodos((prev) => [...prev, newTodo]);
    }
  };

  useEffect(() => {
    return () => {
      channelRefs.current.forEach((topic) => topic.close());
      channelRefs.current.clear();
    };
  }, []);

  return (
    <ChannelContext.Provider
      value={{
        channels,
        broadcastedTodos,
        subscribeToChannel,
      }}
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
