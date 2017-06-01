
class URLParams {
  constructor(location) {
    var search = location.search.substring(1);
    this.params = JSON.parse(
      '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'
    );
  }

  get(name) {
    return this.params[name];
  }
}
