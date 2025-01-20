"use client";
import React, { useState } from "react";
import Edit from "./Edit";

type Todo = {
  TodoID: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

// const Table: React.FC<{ data: any[] }> = ({ data }) => {
//   const [editTodoId, setEditTodoId] = useState<string | null>(null);

//   const handleEdit = (todoId: string) => {
//     setEditTodoId(todoId);
//   };

//   const handleCancelEdit = () => {
//     setEditTodoId(null);
//   };

//   return (
//     <div className="space-y-3 max-h-80 overflow-y-auto">
//       {data.map((todo) => (
//         <div
//           key={todo.TodoID}
//           className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3 hover:bg-gray-100 transition"
//         >
//           {/* Title and Status */}
//           <div className="flex items-center">
//             {/* Status Icon */}
//             {todo.completed ? (
//               <span className="text-green-600 text-sm font-semibold mr-3">
//                 ✔
//               </span>
//             ) : (
//               <span className="text-red-600 text-sm font-semibold mr-3">✘</span>
//             )}
//             {/* Title */}
//             <div>
//               <h6 className="text-sm font-medium text-gray-800 truncate">
//                 {todo.title}
//               </h6>
//             </div>
//           </div>

//           {/* Edit Button */}
//           <div>
//             {editTodoId === todo.TodoID ? (
//               <>
//                 <button
//                   onClick={handleCancelEdit}
//                   className="text-indigo-600 hover:text-indigo-900 mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <Edit title={todo.title} todoId={todo.TodoID} />
//               </>
//             ) : (
//               <button
//                 onClick={() => handleEdit(todo.TodoID)}
//                 className="text-indigo-600 hover:text-indigo-900"
//               >
//                 Edit
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

const Table: React.FC<{ data: any[] }> = ({ data }) => {
  const [editTodoId, setEditTodoId] = useState<string | null>(null);

  const handleEdit = (todoId: string) => {
    setEditTodoId(todoId);
  };

  const handleCancelEdit = () => {
    setEditTodoId(null);
  };

  // Filter out items where the channel is not empty
  const filteredData = data.filter(
    (todo) => !todo.channel || todo.channel.trim() === ""
  );

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {filteredData.map((todo) => (
        <div
          key={todo.TodoID}
          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3 hover:bg-gray-100 transition"
        >
          {/* Title and Status */}
          <div className="flex items-center">
            {/* Status Icon */}
            {todo.completed ? (
              <span className="text-green-600 text-sm font-semibold mr-3">
                ✔
              </span>
            ) : (
              <span className="text-red-600 text-sm font-semibold mr-3">✘</span>
            )}
            {/* Title */}
            <div>
              <h6 className="text-sm font-medium text-gray-800 truncate">
                {todo.title}
              </h6>
            </div>
          </div>

          {/* Edit Button */}
          <div>
            {editTodoId === todo.TodoID ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  Cancel
                </button>
                <Edit title={todo.title} todoId={todo.TodoID} />
              </>
            ) : (
              <button
                onClick={() => handleEdit(todo.TodoID)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Table;
