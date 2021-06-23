const https = require('https');
const cookieParser = require('set-cookie-parser');

/** Class used to implement the crawlers functionality.*/
class SmartCrawlerClass
{
  /** minimum external links needed to continue*/
  MIN_EXTERNALS = 1;

  /** current session */
  currentSession;
  /** If the crawler should interrupt the crawling */
  abort = false;
  /**If the crawler is running */
  isRunning = false;
  /** Domain of the site currently analyzed by the crawler */
  currentDomain = null;

  /**
   * Create a crawler.
   */
  constructor() {
    this.currentSession = null;
  }

  /**
   * Create a new session object.
   * @param {*} url - First url to add to session
   * @returns new session object
   */
  createSession(url){
    try{
      let checkURL = new URL(url);
      return {
        start: new Date(),
        end: '',
        urls: [url],
        urls_done: [],
        results: {}
      };
    } catch(err){
      console.log('Not a url');
      return undefined;
    }
  }

  /**
   * Parse the result input & create a session based on it.
   * Add the url input to the session if the url has not been explored yet.
   * @param {*} url - url input
   * @param {*} result - json result input of a session
   * @returns new session based on result
   */
  continueSession(url, result){
    let session;
    try{
      session = JSON.parse(result);
      if(url && !session.urls_done.includes(url) && !session.urls.includes(url)){
        session.urls.push(url);
      } else {
        console.log('no url defined or already visited.');
      }

      // check parsed session
      if(this.checkParsedSession(session)){
        return session;
      }
      // abort later if session is undefined
      return undefined;
    } catch(err){
      console.error(err);
      console.log('Illegal session\nStarting new session...');
      if(url){
        session = this.createSession(url);
        return session;
      }
      // abort later if session is undefined
      return undefined;
    }
  }

  /**
   * Abort current session if the crawler is crawling.
   */
  abortSession(){
    if(this.isRunning){
      this.abort = true;
    }
  }

  /**
   * Check if parsed session matches the needed session structure
   * @param {*} session - parsed session to check
   * @returns if the session matches the needed structure
   */
  checkParsedSession(session){
    let neededAttrs = ['start','end','urls','urls_done'];
    let neededResultAttrs = ['persistentCookies','sessionCookies','trackingCookies'];

    // check needed outer attributes
    for(let i = 0; i<neededAttrs.length; i++){
      if(session[neededAttrs[i]] === undefined){
        return false;
      }
    }
    // check results
    let res = session['results'];
    if(res === undefined){
      return false;
    }

    // check needed result domain objects
    let resultDomainObjects = res.keys();
    for(let i = 0; i<resultDomainObjects.length; i++){
      // get result domain object
      let resultDomainObject = res[resultDomainObjects[i]];

      // iterate needed attributes of result domain object
      for(let k = 0; k<neededResultAttrs.length; k++){
        if(resultDomainObject[neededResultAttrs[k]] === undefined){
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Checks if the url is a sub site of the domain.
   * @param {*} url - url to check
   * @returns if the url is a sub site of the domain
   */
  isSubSite(url){
    try{
      let site = new URL(url);
      if(site.hostname === this.currentDomain){
        return true;
      }
      return false;
    } catch(err){
      return false;
    }
  }

  /**
   * Start the crawler.
   * @param {*} e - event
   * @param {*} input - input session
   * @returns result of the crawling in current session
   */
  async crawl(e, input){
    // maximum number of redirects
    const maxRedirects = 5;
    // internal urls of current domain
    const internalURLs = [];
    // current url
    let url;

    this.isRunning = true;
    this.currentSession = input;

    console.log('.crawling');
    while(input.urls.length > 0 || internalURLs.length > 0){
      // check for abort
      if(this.abort){
        console.log('.abort');
        break;
      }
      // get next url
      if(input.urls.length >= this.MIN_EXTERNALS){
        url = input.urls.pop();
      } else {
        url = internalURLs.pop();
      }

      //download
      try{
        console.log('..fetching '+url)
        let download = await this.fetch(url);

        //add url to visited
        input.urls_done.push(url);

        // set current domain
        this.currentDomain = new URL(url).hostname;

        // display urls in frontend
        e.sender.send('htmlReceived', JSON.stringify(input.urls_done, null, 2));

        let redirectCount = 0;
        //handle redirects
        while(download.status !== 200 && redirectCount < maxRedirects){
          redirectCount++;
          url = download.redirectURL;
          console.log('..fetching redirect '+url);
          download = await this.fetch(url);

          //add redirect url to visited
          input.urls_done.push(url);
        }


        // continue when stuck in redirect loop
        if(redirectCount === maxRedirects){
          continue;
        }

        //parse
        console.log('..parsing');
        let parsedResult = await this.parse(download);

        // add external links to result
        if(parsedResult.externalLinks !== null){
          parsedResult.externalLinks.forEach((link)=>{
            // check if url is already contained
            if(!input.urls.includes(link) && !input.urls_done.includes(link)){
              input.urls.push(link);
            }
          });
        }

        /* add parsed cookies to result
        if(parsedResult.cookies !== null){
          parsedResult.cookies.forEach(cookie => {
            input.results.initialCookies[cookie.name] = cookie.value;
          });
        } */

        console.log("external: "+input.urls.length);
        console.log("internal: "+internalURLs.length);
        // check if there are external links to follow
        if(input.urls.length < this.MIN_EXTERNALS){
          // add internal urls to analyze because no external urls were found
          if(parsedResult.urls !== null){
            parsedResult.urls.forEach((link)=>{
              console.log("adding internal:" + link);
              // check if url is already contained
              if(!internalURLs.includes(link) && !input.urls_done.includes(link)){
                internalURLs.push(link);
              }
            });
          }
        } else {
          // clear internal urls and continue crawling to next domain
          internalURLs.length = 0;
        }
        console.log("external: "+input.urls.length);
        console.log("internal: "+internalURLs.length);
      } catch(err){
        console.log(err);
      }
      //set end date
      input.end = new Date();
    }
    console.log('.finishing');
    // reset running state
    this.isRunning = false;
    // reset abort if crawler was stopped with button press
    this.abort = false;
    return input;
  }

  /**
   * Check if website sets cookies
   * @param {*} headers - headers of downloaded website
   * @returns Array of with initial Cookies set by the website
   */
  checkCookies(headers){
    // return if no set-cookie header present
    let cookies = [];
    if (headers['set-cookie'] === undefined){
      return cookies;
    }
    let cookieHeader = String(headers['set-cookie']);
    let cookieStrings = cookieParser.splitCookiesString(cookieHeader);

    // parse cookies
    cookieStrings.forEach(string => {
      let cookie = cookieParser.parseString(string, {decodeValues: true});
      cookies.push(cookie);
    });
    return cookies;
  }

  /**
   * Extract urls from the tags & sort them.
   * @param {*} urls - tags & attributes with urls to be extracted
   * @param {*} attribute - base attribute used for slicing e.g. script src=
   * @returns object with extraced internal & external urls.
   */
  extractUrls(urls, attribute){
    let external = [];
    let internal = [];
    //script src=""
    urls.forEach((url) => {
      const sliced = url.slice(attribute.length+1, url.length-1);
        if(this.isSubSite(sliced)){
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
   * @param {*} body - body of website
   * @returns array of links to external sites
   */
  parseLinks(body){
    const hrefRegex = /href="https?:\/\/[a-zA-Z0-9/?=:._-]*"/g;

    let internalUrls = [];
    let externalLinks = [];

    // href (styles, fonts & links)
    let regexRes = body.match(hrefRegex);

    if(regexRes !== null){
      let res = this.extractUrls(regexRes, 'href=');
     
      // categorize
      internalUrls = internalUrls.concat(res.internal);
      res.external.forEach((url)=>{
        if(url.includes('font') || url.endsWith('.ttf') || url.endsWith('.otf') || url.endsWith('.css')){
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
   * Parse the downloaded website for privacy relevant data.
   * @param {*} result - downloaded website
   * @returns downloaded website and extracted privacy data of the website
   */
  async parse(result) {
    let ressources = this.parseLinks(result.body);
    let cookies = this.checkCookies(result.headers);
    return new Promise((resolve, reject) => {
      resolve({
        status: result.statusCode,
        header: result.headers,
        body: result.body,
        externalLinks: ressources.externalLinks,
        urls: ressources.internalUrls,
        cookies: cookies,
      });
    });
  }

  /**
   * Download a webpage.
   * @param {string} url - The URL to download.
   * @returns {Promise} A promise object with status, headers and content.
   */
  fetch(url) {
    return new Promise((resolve, reject) => {
      console.log('...getting');
      https.get(url, (res)=> {
        let data = [];
        
        // Request unsuccessful
        if(res.statusCode !== 200){
          if(res.statusCode == 301 || res.statusCode == 302){
            console.log(`....redirect to ${res.headers.location}`);
            resolve({
              status: res.statusCode,
              redirectURL: res.headers.location
            })
          } else{
            reject(`Download not successful! Status-Code of Response: ${res.statusCode}`);
          }
        }

        // Add the data chunks to array to concat later
        res.on('readable', function (){
          let chunk = this.read() || '';
          data.push(chunk);
        });

        // Concat Data chunks and return
        res.on('end', function(){
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