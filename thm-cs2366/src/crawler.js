const https = require('https');
const cookieParser = require('set-cookie-parser');

/** Class used to implement the crawlers functionality.*/
class SmartCrawlerClass
{
  /** current session */
  currentSession;
  /** If the crawler should interrupt the crawling */
  abort = false;
  /**If the crawler is running */
  isRunning = false;

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
        domain: null,
        results: {
          externalFonts : [],
          externalImages: [],
          externalScripts: [],
          externalStyles: [],
          externalFrames: [],
          externalLinks : [],
          initialCookies: {},
          imprintLinks: [],
          privacyLinks: []
        }
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
      if(url && !session.urls_done.includes(url) && !session.urls.includes(url) && this.isSubSite(url)){
        session.urls.push(url);
      } else {
        console.log('no url defined or already done.');
      }

      // check parsed session
      if(this.checkParsedSession(session)){
        return session;
      }
      return undefined;
    } catch(err){
      console.error(err);
      console.log('Illegal session\nStarting new session...');
      if(url){
        session = this.createSession(url);
        return session;
      }
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
    let neededAttrs = ['start','end','urls','urls_done','domain'];
    let neededResultAttrs = ['externalFonts','externalImages','externalScripts','externalStyles','externalFrames', 'externalLinks', 'initialCookies', 'imprintLinks', 'privacyLinks'];

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

    // check needed result attributes
    for(let i = 0; i<neededResultAttrs.length; i++){
      if(res[neededResultAttrs[i]] === undefined){
        return false;
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
      if(site.hostname === this.currentSession.domain){
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
    const maxRedirects = 5;

    this.isRunning = true;
    this.currentSession = input;
    console.log('.crawling');
    while(input.urls.length > 0){
      // check for abort
      if(this.abort){
        console.log('.abort');
        break;
      }
      // get next url
      let url = input.urls.pop();


      // check if url was already visited
      if(input.urls_done.includes(url)){
        continue;
      }

      //download
      try{
        console.log('..fetching '+url)
        let download = await this.fetch(url);

        //add url to visited
        input.urls_done.push(url);

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

        // Set hostname
        if(input.domain === null){
          input.domain = new URL(url).hostname;
        }

        //parse
        console.log('..parsing');
        let parsedResult = await this.parse(download);

        // add parsed urls for crawler
        if(parsedResult.urls !== null){
          parsedResult.urls.forEach((link)=>{
            // check if url is already contained
            if(!input.urls.includes(link) && !input.urls_done.includes(link)){
              input.urls.push(link);
            }
          });
        }
        // add parsed cookies to result
        if(parsedResult.cookies !== null){
          parsedResult.cookies.forEach(cookie => {
            input.results.initialCookies[cookie.name] = cookie.value;
          });
        }

        // add external scripts to result
        if(parsedResult.externalScripts !== null){
          let concat = input.results.externalScripts.concat(parsedResult.externalScripts);
          input.results.externalScripts = [...new Set(concat)];
        }

        // add external images to result
        if(parsedResult.externalImages !== null){
          let concat = input.results.externalImages.concat(parsedResult.externalImages);
          input.results.externalImages = [...new Set(concat)];
        }

        // add external fonts to result
        if(parsedResult.externalFonts !== null){
          let concat = input.results.externalFonts.concat(parsedResult.externalFonts);
          input.results.externalFonts = [...new Set(concat)];
        }

        // add external frames to result
        if(parsedResult.externalFrames !== null){
          let concat = input.results.externalFrames.concat(parsedResult.externalFrames);
          input.results.externalFrames = [...new Set(concat)];
        }

         // add external links to result
        if(parsedResult.externalLinks !== null){
          let concat = input.results.externalLinks.concat(parsedResult.externalLinks);
          input.results.externalLinks = [...new Set(concat)];
        }

        // add external styles to result
        if(parsedResult.externalStyles !== null){
          let concat = input.results.externalStyles.concat(parsedResult.externalStyles);
          input.results.externalStyles = [...new Set(concat)];
        }
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
    const srcRegex = /src="https?:\/\/[a-zA-Z0-9/?=:._-]*"/g;
    const hrefRegex = /href="https?:\/\/[a-zA-Z0-9/?=:._-]*"/g;
    const urlRegex = /"https?:\/\/[a-zA-Z0-9/?=:._-]*"/g;

    const scriptPrefix = /script /g;
    const imgPrefix = /img /g;
    const framePrefix = /frame /g;
    const urlPrefix = /url\(/g;

    let internalUrls = [];
    let externalScripts = [];
    let externalImages = [];
    let externalFrames = [];
    let externalLinks = [];
    let externalStyles = [];
    let externalFonts = [];

    // scripts
    let regex = new RegExp(scriptPrefix.source + srcRegex.source, 'g');
    let regexRes = body.match(regex);

    if(regexRes !== null){
      let res = this.extractUrls(regexRes, 'script src=');
      internalUrls = internalUrls.concat(res.internal);
      externalScripts = res.external;
    }

    // images
    regex = new RegExp(imgPrefix.source + srcRegex.source, 'g');
    regexRes = body.match(regex);

    if(regexRes !== null){
      let res = this.extractUrls(regexRes, 'img src=');
      internalUrls = internalUrls.concat(res.internal);
      externalImages = res.external;
    }

    // frames
    regex = new RegExp(framePrefix.source + srcRegex.source, 'g');
    regexRes = body.match(regex);

    if(regexRes !== null){
      let res = this.extractUrls(regexRes, 'frame src=');
      internalUrls = internalUrls.concat(res.internal);
      externalFrames = res.external;
    }

    // fonts in styles
    regex = new RegExp(urlPrefix.source + urlRegex.source, 'g');
    regexRes = body.match(regex);

    if(regexRes !== null){
      let res = this.extractUrls(regexRes, 'url(');
      internalUrls = internalUrls.concat(res.internal);
      externalFonts = res.external;
    }

    // href (styles, fonts & links)
    regexRes = body.match(hrefRegex);

    if(regexRes !== null){
      let res = this.extractUrls(regexRes, 'href=');
     
      // categorize
      internalUrls = internalUrls.concat(res.internal);
      res.external.forEach((url)=>{
        if(url.includes('font') || url.endsWith('.ttf') || url.endsWith('.otf')){
          externalFonts.push(url);
        }
        else if(url.endsWith('.css')){
          externalStyles.push(url);
        } else {
          externalLinks.push(url);
        }
      });
    }
    
    // remove duplicates if present
    internalUrls = [...new Set(internalUrls)];
    externalScripts = [...new Set(externalScripts)];
    externalImages = [...new Set(externalImages)];
    externalFrames = [...new Set(externalFrames)];
    externalLinks = [...new Set(externalLinks)];
    externalStyles = [...new Set(externalStyles)];
    externalFonts = [...new Set(externalFonts)];

    return {
      internalUrls: internalUrls,
      externalScripts: externalScripts,
      externalImages: externalImages,
      externalFrames: externalFrames,
      externalLinks: externalLinks,
      externalStyles: externalStyles,
      externalFonts: externalFonts
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
        externalScripts: ressources.externalScripts,
        externalImages: ressources.externalImages,
        externalFrames: ressources.externalFrames,
        externalLinks: ressources.externalLinks,
        externalStyles: ressources.externalStyles,
        externalFonts: ressources.externalFonts,
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
