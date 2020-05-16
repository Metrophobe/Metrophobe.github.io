const ds = {
  capih: "https://api.countapi.xyz/hit/metrophobe.github.com/visits",
  capig: "https://api.countapi.xyz/get/metrophobe.github.com/visits",
  github: "https://api.github.com/users/metrophobe/repos",
  about: "https://api.github.com/users/metrophobe",
  quotes: "https://sv443.net/jokeapi/v2/joke/programming?type=single",
  rss2json: "https://api.rss2json.com/v1/api.json?rss_url=",
  twitter: "https://twitrss.me/twitter_user_to_rss/?user=metrophobe",
  codepen: "https://codepen.io/Metrophobe/public/feed?",

  getJson: async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  },
};

export default class MeshUp {
  constructor() {
    this.stats = {
      visitor: 0,
      total: 0,
    };
    this.git = {};
    this.quote = {};
    this.about = {};
    this.tweets = {};
    this.codepens = {};
  }

  async load() {
    this.stats.visitor = (await ds.getJson(ds.capih)).value;
    this.git = await ds.getJson(ds.github);
    this.about = await ds.getJson(ds.about);
    this.quote = (await ds.getJson(ds.quotes)).joke;
    this.tweets = await ds.getJson(ds.rss2json + ds.twitter);
    this.codepens = await ds.getJson(ds.rss2json + ds.codepen);
  }

  async updateStats() {
    this.stats.total = (await ds.getJson(ds.capig)).value;
  }
}
