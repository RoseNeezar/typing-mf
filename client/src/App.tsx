import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Game from "./page/game/Game.page";
import Home from "./page/home/Home.page";

export const Wrapper: FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: {
          opacity: 0,
        },
        in: {
          opacity: 1,
        },
        out: {
          opacity: 0,
        },
      }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 50,
      }}
    >
      <Outlet />
    </motion.div>
  );
};

const NotFound = () => {
  return (
    <div className="bg-dark-main flex h-screen items-center justify-center">
      <div className="bg-dark-third rounded-lg p-10 text-xl font-bold tracking-widest text-white">
        Lost ??
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <>
      <AnimatePresence exitBeforeEnter>
        <Routes key={"1"} location={background || location}>
          <Route element={<Wrapper />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/game/:gameID" element={<Game />} />
            <Route path="*" element={<NotFound />} />

            {/* <Route path="/" element={<Navigate replace to={`/scrumpoker`} />} /> */}
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
