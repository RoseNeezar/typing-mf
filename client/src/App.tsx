import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { SocketClient } from "./util/promiseSocket";

function App() {
  const events = useMemo(() => new SocketClient(), []);

  const { status, data, error, isFetching } = useQuery(
    ["test"],
    async () =>
      await events.postMessage("create-game", {
        news: "hoho",
      })
  );

  return (
    <div className="flex flex-row w-screen h-screen text-lg bg-purple-400">
      <div className="h-screen bg-purple-100 w-52">
        {/* {useBound.getState().navigate} */}
      </div>
      <div className="mt-10 ">
        <div id="game" />
      </div>
    </div>
  );
}

export default App;
