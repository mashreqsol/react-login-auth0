import React from "react";
import { Info, Repos, User, Search, Navbar } from "../components";

import { GithubContext } from "../context/context";
const Dashboard = () => {
  const { isloading } = React.useContext(GithubContext);
  if (isloading) {
    return (
      <main>
        <Navbar></Navbar>
        <Search></Search>
        <div className="container">
          <div className="loading"></div>
        </div>
      </main>
    );
  }
  return (
    <main>
      <Navbar />
      <Search />
      <Info />
      <User />
    </main>
  );
};

export default Dashboard;
