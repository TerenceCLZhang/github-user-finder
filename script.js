const API_URL = "https://api.github.com";
const AUTH_TOKEN =
  "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";
const noInfoText = "Not specified";

const form = document.getElementById("username-search");

const userInfoContainer = document.getElementById("user-info");

const avatarElement = document.getElementById("avatar");
const nameElement = document.getElementById("name");
const loginElement = document.getElementById("login");
const bioElement = document.getElementById("bio");
const locationElement = document.getElementById("location");
const createdAtElement = document.getElementById("created_at");

const viewProfileBtn = document.getElementById("view-profile-btn");

const followersElement = document.getElementById("followers");
const followingElement = document.getElementById("following");
const publicReposElement = document.getElementById("public-repos");

const companyElement = document.getElementById("company");
const blogElement = document.getElementById("blog");
const twitterElement = document.getElementById("twitter");

const reposContainer = document.getElementById("repos-container");

let username = "terenceclzhang";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  username = document.getElementById("username").value.trim();
  loadData();
});

const loadData = async () => {
  await setUserData();
  await setReposData();
};

const setUserData = async () => {
  const findUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${username}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const displayUserData = () => {
    avatarElement.src = userData.avatar_url;

    nameElement.textContent = userData.name;
    loginElement.textContent = userData.login;
    bioElement.textContent = userData.bio;
    locationElement.textContent = userData.location || noInfoText;
    createdAtElement.textContent = formateDate(userData.created_at);

    viewProfileBtn.href = userData.html_url;

    followersElement.textContent = userData.followers;
    followingElement.textContent = userData.following;
    publicReposElement.textContent = userData.public_repos;

    companyElement.textContent = userData.company || noInfoText;
    blogElement.textContent = userData.blog || noInfoText;
    twitterElement.textContent = userData.twitter_username || noInfoText;
  };

  const userData = await findUser();
  displayUserData();
};

const setReposData = async () => {
  const findUserRepos = async () => {
    reposContainer.innerHTML = "<p>Loading...</p>";
    try {
      const response = await fetch(
        `${API_URL}/users/${username}/repos?sort=updated&direction=desc`,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const displayReposData = () => {
    reposContainer.innerHTML = "";
    if (reposData.length > 0) {
      for (const item of reposData) {
        const repoDiv = document.createElement("div");
        repoDiv.classList.add("repo-card");

        repoDiv.innerHTML = `
        <h4><a href=${item.html_url} target="_blank">${item.name}</a></h4>
        <p>${item.description || ""}</p>
        <span>${item.stargazers_count}</span>
        <span>${item.forks}</span>
        <span>${formateDate(item.updated_at)}</span>`;

        reposContainer.appendChild(repoDiv);
      }
    } else {
      reposContainer.innerHTML = "<p>No repos to show</p>";
    }
  };

  const reposData = await findUserRepos();
  displayReposData();
};

const formateDate = (dateString) => {
  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

loadData();
