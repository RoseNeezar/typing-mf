import React, { useMemo } from "react";
import { TimerState, syncStore } from "../../../hooks/syncStore";
import { useStore } from "../../../hooks/useStore";

type Props = {};

const GameCountdown = (props: Props) => {
  const data = useStore<TimerState>("TimerEvents", syncStore);

  const time = useMemo(() => {
    if (typeof data.countDown === "number") {
      return data.countDown;
    } else {
      return data?.countDown?.split(":");
    }
  }, [data?.countDown]);

  return Object.keys(data).length > 0 ? (
    <div className="m-auto">
      <span className="m-auto mt-10 font-mono text-6xl countdown">
        {typeof data.countDown === "number" ? (
          <span
            className=""
            // @ts-ignore
            style={{ "--value": time }}></span>
        ) : (
          <>
            <span
              className=""
              // @ts-ignore
              style={{ "--value": parseInt(time[0]) }}></span>
            m
            <span
              className=""
              // @ts-ignore
              style={{ "--value": parseInt(time[1]) }}></span>
            s
          </>
        )}
      </span>
      <div className="mt-3 text-lg font-bold text-center text-secondary">
        {data?.msg}
      </div>
    </div>
  ) : null;
};

export default GameCountdown;
