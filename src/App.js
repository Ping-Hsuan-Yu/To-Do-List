import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CLIENT_ID = "79982134b31c82508910";

const NavBar = styled.nav`
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 2px 2px 4px #00000040;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  & img {
    width: 40px;
    height: 40px;
    clip-path: circle(20px at 20px 20px);
    border: 1px solid #d3d3d3;
    border-radius: 50%;
    margin-right: 8px;
  }
  & div {
    & span:first-child {
      display: block;
      font-weight: bold;
    }
    & span:last-child {
      color: #a9a9a9;
    }
  }
`;

const LogBtn = styled.button`
  border: 0;
  border-radius: 4px;
  padding: 8px;
  background-color: royalblue;
  color: white;
  box-shadow: 2px 2px 4px #00000040;
  font-size: 16px;
`;

const TaskList = styled.div`
  margin: 32px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 4px;
  & div:hover {
    box-shadow: 2px 2px 4px #00000040;
    border-radius: 4px;
  }
  & div {
    margin: 16px 0px;
    padding: 8px;
    & span {
      display: block;
    }
  }
`;

export default function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  const [issueData, setIssueData] = useState([]);

  async function getUserData() {
    await fetch("http://localhost:4000/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUserData(data);
      });
  }
  async function getIssueData() {
    await fetch("http://localhost:4000/getIssueData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setIssueData(data);
      });
  }
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
    if (localStorage.getItem("accessToken") !== null) {
      getUserData();
      getIssueData();
    }
  }, []);

  const Task = ({ data }) => {
    return (
      <div>
        <span>{data.title}</span>
        <span>{data.body}</span>
        <span>{data.user.login}</span>
      </div>
    );
  };

  async function loginWithGithub() {
    await window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID).then(() => {
      setRerender(!rerender);
    });
  }

  return (
    <>
      <NavBar>
        <UserInfo>
          <img src={userData.avatar_url} />
          <div>
            <span>{userData.name}</span>
            <span>{userData.login}</span>
          </div>
        </UserInfo>
        {localStorage.getItem("accessToken") ? (
          <>
            <LogBtn
              onClick={() => {
                localStorage.removeItem("accessToken");
                setRerender(!rerender);
              }}
            >
              LogOut
            </LogBtn>
          </>
        ) : (
          <LogBtn onClick={loginWithGithub}>Login with GitHub</LogBtn>
        )}
      </NavBar>
      <TaskList>
        {issueData.map((val, idx) => (
          <Task data={val} key={idx} />
        ))}
      </TaskList>
    </>
  );
}
