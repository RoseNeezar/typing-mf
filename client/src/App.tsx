import {
  Link,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import Game from "./page/game/Game.page";
import Home from "./page/home/Home.page";
import { Dialog, Transition } from "@headlessui/react";
import { useState, useRef, Fragment } from "react";

const Modal = () => {
  const match = useMatch("create-game");
  console.log("pull up");
  const navigate = useNavigate();
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => navigate("/")}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      kimak
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900">
                        Deactivate account
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to deactivate your account? All
                          of your data will be permanently removed. This action
                          cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
                    Deactivate
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Home />}>
          <Route path="/create-game" element={<Modal />} />
        </Route>
        <Route path="/:gameID" element={<Game />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/create-game" element={<Modal />} />
        </Routes>
      )}
    </>
  );
}

export default App;
