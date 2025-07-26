const API_URL = "https://api.github.com";
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
      const response = await fetch(`${API_URL}/users/${username}`);
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
    locationElement.textContent = userData.location;
    createdAtElement.textContent = userData.created_at;

    viewProfileBtn.href = userData.html_url;

    followersElement.textContent = userData.followers;
    followingElement.textContent = userData.following;
    publicReposElement.textContent = userData.public_repos;

    companyElement.textContent = userData.company || "No Company";
    blogElement.textContent = userData.blog || "No Personal Website";
    twitterElement.textContent = userData.twitter_username || "No Twitter";
  };

  const userData = await findUser();
  displayUserData();
};

const setReposData = async () => {
  const findUserRepos = async () => {
    reposContainer.innerHTML = "<p>Loading Repos...</p>";
    try {
      const response = await fetch(
        `${API_URL}/users/${username}/repos?sort=updated&direction=desc`
      );
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const displayReposData = () => {
    for (const item of reposData) {
      console.log(
        item.name,
        item.description,
        item.stargazers_count,
        item.forks,
        item.updated_at,
        item.html_url
      );
    }
  };

  const reposData = await findUserRepos();
  displayReposData();
};
