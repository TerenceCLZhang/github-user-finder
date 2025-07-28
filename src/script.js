const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
const API_URL = "https://api.github.com";
const noInfoText = "Not specified";

const form = document.getElementById("username-search");
const formErrorElement = document.getElementById("form-error");
const searchBtnElement = document.getElementById("search-btn");

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

  username = document
    .getElementById("username")
    .value.trim()
    .replace(/ /g, "-");

  if (username === "") {
    formErrorElement.textContent =
      "ERROR: Username field cannot be empty. Please enter a valid username.";
    return;
  }

  loadData();
});

const loadData = async () => {
  formErrorElement.textContent = "";

  searchBtnElement.value = "Loading...";
  searchBtnElement.disabled = true;
  viewProfileBtn.classList.add("disabled");

  await setUserData();
  await setReposData();

  searchBtnElement.value = "Search";
  searchBtnElement.disabled = false;
  viewProfileBtn.classList.remove("disabled");
};

const setUserData = async () => {
  const findUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${username}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      const userData = await response.json();

      if (response.status === 404) {
        formErrorElement.textContent = userData.message
          ? `ERROR: ${userData.message}. Please ensure the username is correct.`
          : "ERROR: Something went wrong. Please try again.";
      }

      return userData;
    } catch (error) {
      console.log(error);
      formErrorElement.textContent = "An unexpected error occured";
    }
  };

  const displayUserData = () => {
    avatarElement.src = userData.avatar_url || "/assets/default.png";

    nameElement.textContent = userData.name;
    loginElement.textContent = userData.login || "N/A";
    bioElement.textContent = escapeHTML(userData.bio);
    locationElement.textContent = userData.location || noInfoText;
    createdAtElement.textContent = formateDate(userData.created_at);

    viewProfileBtn.href = userData.html_url || "https://github.com/";

    const followerCount = userData.followers || 0;
    followersElement.textContent = `${followerCount} ${
      followerCount === 1 ? "follower" : "followers"
    }`;

    const followingCount = userData.following || 0;
    followingElement.textContent = `${followingCount} following`;

    const repoCount = userData.public_repos || 0;
    publicReposElement.textContent = `${repoCount} ${
      repoCount === 1 ? "repository" : "repositories"
    }`;

    companyElement.textContent = userData.company || noInfoText;

    blogElement.textContent = userData.blog || noInfoText;
    if (userData.blog) {
      const blogURL = userData.blog?.startsWith("http")
        ? userData.blog
        : `https://${userData.blog}`;
      blogElement.href = blogURL;
    } else {
      blogElement.removeAttribute("href");
    }

    twitterElement.textContent = userData.twitter_username || noInfoText;
    if (userData.twitter_username) {
      twitterElement.href = `https://x.com/${userData.twitter_username}`;
    } else {
      twitterElement.removeAttribute("href");
    }
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
      formErrorElement.textContent = "An unexpected error occured";
    }
  };

  const displayReposData = () => {
    reposContainer.innerHTML = "";
    if (reposData.length > 0) {
      for (const item of reposData) {
        const repoDiv = document.createElement("div");
        repoDiv.classList.add("repo-card");

        repoDiv.innerHTML = `
        <div>
          <h4><i class="fa-solid fa-code-branch"></i> <a href=${
            item.html_url
          } target="_blank" class="repo-name">${item.name}</a></h4>
          <p class="repo-desc">${escapeHTML(item.description) || ""}</p>
        </div>
        
        <div class="repo-info">
          <div><i class="fa-solid fa-circle ${item.language}"></i> <span>${
          item.language || "N/A"
        }</span></div>
          <div><i class="fa-solid fa-star"></i> <span>${
            item.stargazers_count
          }</span></div>
          <div><i class="fa-solid fa-code-fork"></i> <span>${
            item.forks
          }</span></div>
          <div><i class="fa-solid fa-clock-rotate-left"></i> <span>${formateDate(
            item.updated_at
          )}</span></div>
        </div>`;

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

const escapeHTML = (str) => {
  if (!str) return "";

  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

loadData();
