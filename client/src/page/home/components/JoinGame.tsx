import React from "react";

type Props = {};

const JoinGame = (props: Props) => {
  return (
    <div className="text-left bg-gray-600">
      <div className="flex min-h-full">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="w-full max-w-sm mx-auto lg:w-96">
            <div className="mt-8">
              <div>
                <div className="relative mt-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="p-3 text-lg text-white rounded-lg bg-zinc-500">
                      Join Game
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white">
                      Nickname
                    </label>
                    <div className="mt-1">
                      <input
                        name="nickname"
                        required
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mt-5"></div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white">
                      Game ID
                    </label>
                    <div className="mt-1">
                      <input
                        name="gameID"
                        required
                        className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex justify-center w-full px-4 py-2 text-sm btn btn-primary">
                      Ok
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGame;
