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
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {filteredData.map((todo) => (
        <div
          key={todo.TodoID}
          className="flex items-center bg-white shadow-sm border border-gray-200 rounded-md p-2 hover:bg-gray-50 transition"
        >
          {/* Status Icon */}
          <div className="flex-none mr-3">
            {todo.completed ? (
              <span className="text-green-500 text-xl font-bold">✔</span>
            ) : (
              <span className="text-red-500 text-xl font-bold">✘</span>
            )}
          </div>

          {/* Main Ticket Content */}
          <div className="flex-grow">
            {/* Ticket Number as Badge */}
            <div className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 rounded-md px-2 py-1">
              {todo.TodoID.toUpperCase()}
            </div>
            {/* Ticket Title */}
            <div className="text-sm font-medium text-gray-800 truncate mt-1">
              {todo.title}
            </div>
          </div>

          {/* Edit Icon */}
          <div className="flex-none">
            {editTodoId === todo.TodoID ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="text-red-600 hover:text-red-800 text-xs font-medium mr-2"
                >
                  Cancel
                </button>
                <Edit title={todo.title} todoId={todo.TodoID} />
              </>
            ) : (
              <button
                onClick={() => handleEdit(todo.TodoID)}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Edit"
              >
                {/* Pencil Icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Table;
