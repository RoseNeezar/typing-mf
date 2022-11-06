import { useSyncExternalStore } from "react";
import { IState, syncStore } from "./syncStore";

export const useStore = <T,>(
  selector: keyof IState,
  store: typeof syncStore
) => {
  const useSelector = <T,>(
    selector = (state: IState) => state as unknown as T
  ): T =>
    useSyncExternalStore(store.subscribe, () => selector(store.getState()));

  return useSelector((s) => s[selector]) as unknown as T;
};
