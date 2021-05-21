import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithunpmbUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [requests, setRequests] = useState(0);
  const [isloading, setIsloading] = useState(false);

  const [error, setError] = useState({ show: false, msg: `` });

  const searchGithubUser = async (user) => {
    toggleError();
    setIsloading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log(error)
    );
    console.log(response);
    if (response) {
      setGithubUser(response.data);
      const { repos_url, followers_url } = response.data;
      await Promise.allSettled([
        axios(`${repos_url}?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((response) => {
          const [repos, followers] = response;

          const status = `fulfilled`;
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((error) => console.log(error));
      // axios(`${repos_url}?per_page=100`).then((response) =>
      //   setRepos(response.data)
      // );
      // axios(`${followers_url}?per_page=100`).then((response) =>
      //   setFollowers(response.data)
      // );
    } else {
      toggleError(true, `User does not exist`);
    }
    checkRequests();
    setIsloading(false);
  };

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, `You have excceded your hourly requests limit.`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function toggleError(show = false, msg = ``) {
    setError({ show, msg });
  }

  useEffect(checkRequests, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isloading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
export { GithubProvider, GithubContext };
