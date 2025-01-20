import { useChannel } from "@/context/ChannelContext";
import Table from "../Todos/Table";

const BroadcastedTodos = () => {
  const { broadcastedTodos } = useChannel();

  return (
    <div>
      {broadcastedTodos && broadcastedTodos.length > 0 ? (
        <>
          <h4 className="text-center mt-3">Broadcasted Todos</h4>
          <Table data={broadcastedTodos} />
        </>
      ) : (
        <h4 className="text-center mt-5">No Broadcasted Todos</h4>
      )}
    </div>
  );
};

export default BroadcastedTodos;
