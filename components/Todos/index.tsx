import React, { useEffect, useState } from "react";
import Table from "./Table";
import { listTodosAppsync } from "@/actions/appsync.actions";
import { useUserStore } from "@/store/userStore";
import useSWR from "swr";
import { config } from "../../ConfigureAmplifyClientSide";
import { Amplify } from "aws-amplify";


Amplify.configure(config);

// const Todos = () => {
//   const { sub } = useUserStore();
//   const { broadcastedTodos } = useChannel();
//   const [personalTodos, setPersonalTodos] = useState([]);
//   const { data, error } = useSWR(sub ? ["todos", sub] : null, () =>
//     listTodosAppsync(sub as string)
//   ) as any;

//   useEffect(() => {
//     if (data) {
//       setPersonalTodos(data || []);
//     }
//   }, [data]);

//   if (!sub) {
//     return <div>Loading</div>;
//   }

//   if (error) {
//     return <div>Error occurred while fetching todos</div>;
//   }

//   if (!personalTodos || personalTodos.length === 0) {
//     return <h4 className="text-center mt-5">Create Todo's</h4>;
//   }
//   console.log("broadcasted to dos =", broadcastedTodos);
//   return (
//     <div>
//       <Table data={broadcastedTodos as any} />
//       <Table data={personalTodos as any} />
//     </div>
//   );
// };

const Todos = () => {
  const { sub } = useUserStore();
  const [personalTodos, setPersonalTodos] = useState([]);
  const { data, error } = useSWR(sub ? ["todos", sub] : null, () =>
    listTodosAppsync(sub as string)
  ) as any;

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

  return (
    <div>
      {personalTodos && personalTodos.length > 0 ? (
        <>
          <h4 className="text-center mt-3">Personal Todos</h4>
          <Table data={personalTodos} />
        </>
      ) : (
        <h4 className="text-center mt-5">Create Personal Todos</h4>
      )}
    </div>
  );
};

export default Todos;
