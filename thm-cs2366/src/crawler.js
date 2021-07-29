const https = require('https');
const cookieParser = require('set-cookie-parser');
const { DomainResult } = require("./domainResult");
const Requests = require('./requests.js');

/** 
 * Class used to implement the crawlers functionality
 */
class SmartCrawlerClass {
  /** minimum external links needed to continue*/
  MIN_EXTERNALS = 2;
  /** current session */
  currentSession;
  /** If the crawler should interrupt the crawling */
  abort = false;
  /**If the crawler is running */
  isRunning = false;
  /** Domain of the site currently analyzed by the crawler */
  currentDomain = null;
  /** Generic user agent is used */
  isUaGeneric = true;
  /** Special user agent is used */
  isUaSpecial = false;
  /** Custom user agent string */
  custom_ua;
  /** Check if DNT Header should be used */
  isDNT = true;
  /** Check if GPC Header should be used */
  isGPC = false;
  /** Breadth search */
  isBreadth = true;
  /** Single page search */
  isSingle = false;

  /**
   * Create a crawler
   */
  constructor() {
    this.currentSession = null;
  }

  /**
   * Abort current session if the crawler is crawling
   */
  abortSession() {
    if (this.isRunning) {
      this.abort = true;
    }
  }

  /**
   * Helper function to create a settings object
   * 
   * @returns the settings
   */
  createSettings() {
    var settings = {
      Generic: this.isUaGeneric,
      Special: this.isUaSpecial,
      DNT: this.isDNT,
      GPC: this.isGPC,
      Breadth: this.isBreadth,
      Single: this.isSingle
    }
    return settings;
  }

  /**
   * Checks if the url is a sub site of the domain
   * 
   * @param {*} url url to check
   * @returns if the url is a sub site of the domain
   */
  isSubSite(url) {
    try {
      let site = new URL(url);
      return site.hostname === this.currentDomain;

    } catch (err) {
      return false;
    }
  }

  /**
   * Start the crawler
   * 
   * @param {*} e event
   * @param {*} input input session
   * @returns result of the crawling in current session
   */
  async crawl(e, input) {
    // maximum number of redirects
    const maxRedirects = 5;
    // internal urls of current domain
    const internalURLs = [];
    // current url
    let url;

    this.isRunning = true;
    this.currentSession = input;

    // start spinner
    e.sender.send('onStarted');

    while (input.urls.length > 0 || internalURLs.length > 0) {
      // check for abort
      if (this.abort) {
        break;
      }
      // get next url
      if (input.urls.length >= this.MIN_EXTERNALS) {
        url = input.urls.pop();
      } else if (internalURLs.length > 0) {
        url = internalURLs.pop();
      } else {
        // no internal urls, but at least 1 external -> continue
        url = input.urls.pop();
        if (url === undefined) {
          break;
        }
      }

      //download
      try {
        let download = await this.fetch(url, false);

        //add url to visited
        input.urls_done.push(url);

        // set current domain
        this.currentDomain = new URL(url).hostname;

        // display urls in frontend
        e.sender.send('htmlReceived', this.currentDomain);

        let redirectCount = 0;
        //handle redirects
        while (download.status !== 200 && redirectCount < maxRedirects) {
          redirectCount++;
          url = download.redirectURL;
          download = await this.fetch(url, false);

          //add redirect url to visited
          input.urls_done.push(url);
        }


        // continue when stuck in redirect loop
        if (redirectCount === maxRedirects) {
          continue;
        }

        //parse
        let parsedResult = await this.parse(download);

        // add external links to result
        if (parsedResult.externalLinks !== null) {
          parsedResult.externalLinks.forEach((link) => {
            // check if url is already contained
            if (!input.urls.includes(link) && !input.urls_done.includes(link)) {
              input.urls.push(link);
            }
          });
        }

        // Fetch url with DNT/GPC Header
        let DNT_obj = await this.fetchDNT(url, maxRedirects);

        if (DNT_obj !== undefined) {
          parsedResult.trackingCookies = this.compareCookies(DNT_obj, parsedResult);
        } else {
          parsedResult.trackingCookies = {};
        }

        DomainResult.fillDomainResultObject(this.currentDomain, this.currentSession, parsedResult.persistentCookies,
          parsedResult.sessionCookies, parsedResult.trackingCookies);

        // check if there are external links to follow
        if (input.urls.length < this.MIN_EXTERNALS) {
          // add internal urls to analyze because no external urls were found
          if (parsedResult.urls !== null) {
            parsedResult.urls.forEach((link) => {
              // check if url is already contained
              if (!internalURLs.includes(link) && !input.urls_done.includes(link)) {
                internalURLs.push(link);
              }
            });
          }
        } else {
          // clear internal urls and continue crawling to next domain
          internalURLs.length = 0;
        }
      } catch (err) {
        console.error(err);
      }
      //set end date
      input.end = new Date();
      if (this.isSingle) {
        break;
      }
    }
    // reset running state
    this.isRunning = false;
    // reset abort if crawler was stopped with button press
    this.abort = false;
    return input;
  }

  /**
   * Executes a fetch with the DNT header set
   * 
   * @param {*} url the url to be fetched
   * @param {*} maxRedirects the max number of redirects
   * @returns cookies that were set with DNT on
   */
  async fetchDNT(url, maxRedirects) {
    let download = await this.fetch(url, true);
    let redirectCount = 0;
    while (download.status !== 200 && redirectCount < maxRedirects) {
      redirectCount++;
      if (url == download.redirectURL) {
        break;
      } else {
        url = download.redirectURL;
      }
      download = await this.fetch(url, true);
    }

    let cookies;
    if (download.headers == undefined) {
      return;
    } else {
      cookies = this.checkCookies(download.headers);
    }
    return {
      persistentCookies: cookies.persistentCookies,
      sessionCookies: cookies.sessionCookies,
      trackingCookies: cookies.trackingCookies
    };
  }

  /**
   * Compares DNT cookies with no DNT cookies and adds result to external cookies
   * 
   * @param {*} DNT_obj the DNT object
   * @param {*} parsedResult result without DNT
   * @returns tracking cookies
   */
  compareCookies(DNT_obj, parsedResult) {
    let tracking = {};
    if (Object.keys(DNT_obj.persistentCookies).length === Object.keys(parsedResult.persistentCookies).length &&
      Object.keys(DNT_obj.sessionCookies).length === Object.keys(parsedResult.sessionCookies).length) {
    } else {

      let dntPersistentCookieNames = Object.keys(DNT_obj.persistentCookies);

      dntPersistentCookieNames.forEach((name) => {
        if (parsedResult.persistentCookies[name] === undefined) {
          tracking[name] = DNT_obj.persistentCookies[name];
        }
      });

      let dntSessionCookieNames = Object.keys(DNT_obj.sessionCookies);

      dntSessionCookieNames.forEach((name) => {
        if (parsedResult.sessionCookies[name] === undefined) {
          tracking[name] = DNT_obj.sessionCookies[name];
        }
      });
    }
    return tracking;
  }

  /**
   * Check if website sets cookies
   * 
   * @param {*} headers headers of downloaded website
   * @returns array of with initial Cookies set by the website
   */
  checkCookies(headers) {
    // init result object
    const result = {
      persistentCookies: {},
      sessionCookies: {},
      trackingCookies: {}
    }

    // return if no set-cookie header present
    let cookies = [];
    if (headers['set-cookie'] === undefined) {
      return result;
    }
    let cookieHeader = String(headers['set-cookie']);
    let cookieStrings = cookieParser.splitCookiesString(cookieHeader);

    // parse cookies
    cookieStrings.forEach(string => {
      let cookie = cookieParser.parseString(string, { decodeValues: true });
      cookies.push(cookie);
    });

    // categorize cookies
    cookies.forEach(cookie => {
      // check "expires" of cookie & categorize them
      if (cookie.maxAge !== undefined || cookie.expires !== undefined) {
        // calculate expires if not set
        if (cookie.expires === undefined) {
          let date = new Date();
          let currSecs = date.getSeconds();
          date.setSeconds(currSecs + cookie.maxAge);

          // set expires for later display
          cookie.expires = date.getSeconds();
        }
        result.persistentCookies[cookie.name] = cookie;
      } else {
        result.sessionCookies[cookie.name] = cookie;
      }
    });
    return result;
  }

  /**
   * Extract urls from the tags and sorts them
   * 
   * @param {*} urls  tags & attributes with urls to be extracted
   * @param {*} attribute  base attribute used for slicing e.g. script src=
   * @returns object with extracted internal & external urls.
   */
  extractUrls(urls, attribute) {
    let external = [];
    let internal = [];
    //script src=""
    urls.forEach((url) => {
      const sliced = url.slice(attribute.length + 1, url.length - 1);
      if (this.isSubSite(sliced)) {
        internal.push(sliced);
      } else {
        external.push(sliced);
      }
    });
    return {
      external: external,
      internal: internal
    }
  }

  /**
   * Parse links to external sites from body of website
   * 
   * @param {*} body body of website
   * @returns array of links to external sites
   */
  parseLinks(body) {
    const hrefRegex = /href="https?:\/\/[a-zA-Z0-9/?=:._-]*"/g;

    let internalUrls = [];
    let externalLinks = [];

    // href (styles, fonts & links)
    let regexRes = body.match(hrefRegex);

    if (regexRes !== null) {
      let res = this.extractUrls(regexRes, 'href=');

      // categorize
      internalUrls = internalUrls.concat(res.internal);
      res.external.forEach((url) => {
        if (url.includes('font') || url.endsWith('.ttf') || url.endsWith('.otf') || url.endsWith('.css')) {
          // do nothing
        } else {
          externalLinks.push(url);
        }
      });
    }

    // remove duplicates if present
    internalUrls = [...new Set(internalUrls)];
    externalLinks = [...new Set(externalLinks)];

    return {
      internalUrls: internalUrls,
      externalLinks: externalLinks,
    };
  }

  /**
   * Parse the downloaded website for privacy relevant data
   * 
   * @param {*} result downloaded website
   * @returns downloaded website and extracted privacy data of the website
   */
  async parse(result) {
    let resources = this.parseLinks(result.body);
    let cookies = this.checkCookies(result.headers);
    return new Promise((resolve) => {
      resolve({
        status: result.statusCode,
        header: result.headers,
        body: result.body,
        externalLinks: resources.externalLinks,
        urls: resources.internalUrls,
        persistentCookies: cookies.persistentCookies,
        sessionCookies: cookies.sessionCookies,
        trackingCookies: cookies.trackingCookies

      });
    });
  }

  /**
   * Download a webpage
   * 
   * @param {string} url the URL to download
   * @returns {Promise} a promise object with status, headers and content
   */
  fetch(url, status) {
    return new Promise((resolve, reject) => {
      var hostname = new URL(url).hostname;

      // Get requests from Requests class
      var DNT_options = Requests.DNT_options;
      DNT_options.hostname = hostname;
      var GPC_options = Requests.GPC_options;
      GPC_options.hostname = hostname;
      var DNT_ua_options = Requests.DNT_ua_options;
      DNT_ua_options.hostname = hostname;
      DNT_ua_options.headers['User-Agent'] = this.custom_ua;
      var GPC_ua_options = Requests.GPC_ua_options;
      GPC_ua_options.hostname = hostname;
      GPC_ua_options.headers['User-Agent'] = this.custom_ua;

      var value;
      if (status) {
        if (this.isDNT) {
          if (this.isUaSpecial) {
            value = DNT_ua_options;
          }
          value = DNT_options;
        } else if (this.isGPC) {
          if (this.isUaSpecial) {
            value = GPC_ua_options;
          }
          value = GPC_options;
        }
      } else {
        value = url;
      }

      https.get(value, (res) => {
        let data = [];

        // Request unsuccessful
        if (res.statusCode !== 200) {
          if (res.statusCode === 301 || res.statusCode === 302) {
            resolve({
              status: res.statusCode,
              redirectURL: res.headers.location
            })
          } else {
            reject(`Download not successful! Status-Code of Response: ${res.statusCode}`);
          }
        }

        // Add the data chunks to array to concat later
        res.on('readable', function () {
          let chunk = this.read() || '';
          data.push(chunk);
        });

        // Concat Data chunks and return
        res.on('end', function () {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data.join('')
          });
        });
        res.on('error', reject);
        res.on('aborted', reject);
      }).on('error', reject);
    });
  }
}
exports.SmartCrawler = new SmartCrawlerClass();
