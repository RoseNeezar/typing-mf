import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment } from "react";
import { useMatch, useNavigate } from "react-router-dom";

type Props = {
  backPath: string;
  renderPath: string;
  body: React.ReactNode;
};

const ModalPage = (props: Props) => {
  const match = useMatch(props.renderPath);

  const navigate = useNavigate();

  return (
    <Transition.Root appear show={!!match} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(props.backPath)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-20" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-0 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative overflow-hidden transition-all transform bg-transparent rounded-lg shadow-2xl">
                {props.body}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalPage;
