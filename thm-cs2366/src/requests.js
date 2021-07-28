/**
 * Class that contains all requests needed for the crawler
 */
class Requests {

  //DNT Header options
  DNT_options = {
    hostname: '',
    method: 'GET',
    headers: {
      'DNT': 1
    }
  };

  // GPC Header options
  GPC_options = {
    hostname: '',
    method: 'GET',
    headers: {
      'GPC': 1
    }
  };

  // DNT with custom user agent
  DNT_ua_options = {
    hostname: '',
    method: 'GET',
    headers: {
      'User-Agent': '',
      'DNT': 1
    }
  };

  // GPC with custom user agent
  GPC_ua_options = {
    hostname: '',
    method: 'GET',
    headers: {
      'User-Agent': '',
      'GPC': 1
    }
  };
}
module.exports = new Requests();