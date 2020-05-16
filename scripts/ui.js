"use strict";

import DS from "./ds.js";

//Data Sources
let ds = new DS();

//Navigation states
let browse = false;
let lastUrl = "#";

//UI
let main;
let sidebar;

//Functions

//Transition
const hide = () => {
  main.classList.remove("move");
  sidebar.style.transform = "translateX(-100vw)";
  browse = false;
};

//Transition
const show = () => {
  main.classList.add("move");
  sidebar.style.transform = "translateX(0vw)";
  browse = true;
};

//Theme
const setTheme = () => {
  let hours = new Date().getHours();
  if ((hours >= 14 && hours <= 19) || (hours >= 5 && hours <= 7)) {
    document.querySelector("article").classList.add("half");
  } else if ((hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)) {
    document.querySelector("article").classList.add("dark");
  } else {
    document.querySelector("article").classList.add("lite");
  }
};

//Widgets
const populateVisits = async (element) => {
  await ds.updateStats();
  element.innerHTML = `<li> YOU ARE </li>
    <li> #${ds.stats.visitor} </li>
    <li> OF </li>
    <li> ${ds.stats.total} </li>
    <li> VISITING ...</li>`;
  element.style.opacity = 1;
};

const populateQWidget = (element) => {
  element.innerHTML = `<p class="quote">...joke of the day ... <br/><br/><b> ${ds.quote}</p> </b>`;
  element.style.opacity = 1;
};

const populateCWidget = (element) => {
  element.innerHTML = "";
  ds.codepens.items.forEach((codepen) => {
    let item = document.createElement("li");
    item.innerHTML = `<b><span class="wtitle"><span class="icon fa fa-codepen"></span> ${
      codepen.title
    } </span></b><br/>
    <b>${codepen.content.replace('width="1024" height="600"', "")}</b>
    <b><p class="wdate">Date Created: ${new Date(
      codepen.pubDate
    ).toLocaleDateString("en-GB")}</p></b>`;
    element.appendChild(item);
  });
};

const populatePRWidget = (pwidget, rwidget) => {
  pwidget.innerHTML = rwidget.innerHTML = "";
  ds.git.forEach((repo) => {
    let item = document.createElement("li");
    item.innerHTML = `
    <b><a class=${repo.has_pages ? "otitle" : "title"} href=${
      repo.has_pages ? "https://metrophobe.github.io/" + repo.name : "#repos"
    }><span class="icon fa fa-github"></span>${repo.name}
    ${
      repo.has_pages ? "<span class='smaller fa fa-hand-o-right'></span>" : ""
    }</a></br><br>
    <b>Description: \t</b>${repo.description}<br>
    <b>Size:</b> ${repo.size}kB<br>
    <b>Last Updated:</b> ${new Date(repo.updated_at).toLocaleDateString(
      "en-GB"
    )}<br>
    <a class="right" href='${repo.html_url}'>Repo....</a>
  `;
    if (repo.has_pages) {
      pwidget.appendChild(item);
    } else {
      rwidget.appendChild(item);
    }
  });
};

const populateUWidget = (element) => {
  element.innerHTML = "";
  ds.tweets.items.forEach((tweet) => {
    let item = document.createElement("li");
    item.innerHTML = `
    <b><span class="wtitle"><span class="icon fa fa-twitter"> 
    </span>${tweet.title}</b>
    <p class="wdate"> Date Posted: ${new Date(tweet.pubDate).toLocaleDateString(
      "en-GB"
    )}</p>`;
    element.appendChild(item);
  });
};

//Events
const wireUpEvents = () => {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.getElementById("menu").addEventListener("click", () => {
    if (browse) hide();
    else show();
  });

  document.querySelectorAll("#sidebar a").forEach((menuItem) => {
    menuItem.addEventListener("click", () => {
      hide();
    });
  });

  sidebar.addEventListener("mousemove", (e) => {
    if (e.target.hash) {
      if (lastUrl != e.target.hash) {
        lastUrl = e.target.hash;
        window.location.href = lastUrl;
      }
    }
  });

  main.addEventListener("click", () => {
    hide();
  });
};

export default class UI {
  constructor() {
    main = document.querySelector("#main");
    sidebar = document.querySelector("#sidebar");
    setTheme();
    hide();
    wireUpEvents();
  }

  async init() {
    await ds.load();
    populateQWidget(document.querySelector("#qwidget"));
    populatePRWidget(
      document.querySelector("#pwidget"),
      document.querySelector("#rwidget")
    );
    populateUWidget(document.querySelector("#uwidget"));
    populateCWidget(document.querySelector("#cwidget"));
    populateVisits(document.querySelector("#visits"));
    setInterval(() => {
      populateVisits(document.querySelector("#visits"));
    }, 60000);
  }
}
