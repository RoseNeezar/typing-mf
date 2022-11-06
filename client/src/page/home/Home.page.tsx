import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

type Props = {};

const Home = (props: Props) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-800">
      <div className="min-h-screen hero bg-base-200">
        <div className="text-center hero-content">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Typing Game</h1>
            <p className="py-6">Test you typing speed !</p>
            <Link to="create-game" state={{ background: location }}>
              <div className="mr-3 btn btn-primary">Create Game</div>
            </Link>
            <Link to="join-game" state={{ background: location }}>
              <div className="btn btn-secondary">Join Game</div>
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Home;
