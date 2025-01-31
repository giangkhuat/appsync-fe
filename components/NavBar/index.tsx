"use client";

import { handleSignOut } from "@/actions/auth.actions";
import { useUserStore } from "@/store/userStore";
import { Disclosure } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import TodoForm from "../TodoForm";
import { useChannel } from "@/context/ChannelContext";

// export default function Navbar() {
//   const { username } = useUserStore();
//   //const { subscribeToChannel } = useChannel();
//   const { channels, subscribeToChannel } = useChannel();

//   const [showTodoForm, setShowTodoForm] = useState(false);
//   const [channelName, setChannelName] = useState("");

//   const signOut = async () => {
//     try {
//       await handleSignOut();
//       window.history.pushState(null, "", "/");
//       window.location.reload();
//     } catch (error) {
//       alert(error);
//     }
//   };

//   const handleSubscribe = () => {
//     if (channelName.trim()) {
//       subscribeToChannel(channelName);
//       setChannelName("");
//     }
//   };

//   return (
//     <>
//       <Disclosure as="nav" className="bg-white shadow">
//         {() => (
//           <>
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//               <div className="flex h-16 justify-between">
//                 <div className="flex">
//                   <div className="hidden md:ml-6 md:flex md:space-x-8">
//                     <a
//                       href="#"
//                       className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
//                     >
//                       Todos
//                     </a>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   {/* Input for channel name */}
//                   <input
//                     type="text"
//                     placeholder="Enter workspace name"
//                     value={channelName}
//                     onChange={(e) => setChannelName(e.target.value)}
//                     className="rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                   />
//                   <button
//                     type="button"
//                     className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                     onClick={handleSubscribe}
//                   >
//                     Subscribe to workspace
//                   </button>
//                   <button
//                     type="button"
//                     className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                     onClick={() => setShowTodoForm(true)}
//                   >
//                     <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
//                     Create Todo
//                   </button>
//                   <p className="inline ml-4 text-sm font-medium text-gray-900">
//                     {username}
//                   </p>
//                   <button
//                     type="button"
//                     className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     onClick={signOut}
//                   >
//                     <span className="sr-only">Sign out</span>
//                     <ArrowLeftEndOnRectangleIcon
//                       className="h-6 w-6"
//                       aria-hidden="true"
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </Disclosure>
//       {showTodoForm && <TodoForm setShowTodoForm={setShowTodoForm} />}
//     </>
//   );
// }

export default function Navbar() {
  const { username } = useUserStore(); // Assuming this hook gives access to user info
  const { subscribeToChannel } = useChannel();

  const [showTodoForm, setShowTodoForm] = useState(false);
  const [channelName, setChannelName] = useState("");

  const signOut = async () => {
    try {
      await handleSignOut();
      window.history.pushState(null, "", "/");
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  const handleSubscribe = () => {
    if (channelName.trim()) {
      subscribeToChannel(channelName);
      setChannelName("");
    }
  };

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow">
        {() => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <a
                      href="#"
                      className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                    >
                      Todos
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Input for channel name */}
                  <input
                    type="text"
                    placeholder="Enter workspace"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={handleSubscribe}
                      style={{ height: "2.5rem" }} // Fix height to ensure consistency
                    >
                      Subscribe to workspace
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => setShowTodoForm(true)}
                      style={{ height: "2.5rem" }} // Fix height to ensure consistency
                    >
                      <PlusIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                      Create Todo
                    </button>
                  </div>

                  <p className="inline ml-4 text-sm font-medium text-gray-900">
                    {username}
                  </p>
                  <button
                    type="button"
                    className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={signOut}
                  >
                    <span className="sr-only">Sign out</span>
                    <ArrowLeftEndOnRectangleIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      {showTodoForm && <TodoForm setShowTodoForm={setShowTodoForm} />}
    </>
  );
}
