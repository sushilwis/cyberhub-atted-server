const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const opn = require('opn');
const destroyer = require('server-destroy');
const fs = require('fs');
const path = require('path');
const conf = require('./config');

// const keyPath = path.join(__dirname, 'oauth2.keys.json');

// let keys = {
//   redirect_uris: [
//     'http://localhost:3000/attendance/oauth2callback'
//   ],
// };

// if (fs.existsSync(keyPath)) {
//   const keyFile = require(keyPath);
//   keys = keyFile.installed || keyFile.web;
// }
const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

const invalidRedirectUri = `The provided keyfile does not define a valid
redirect URI. There must be at least one redirect URI defined, and this sample
assumes it redirects to 'http://localhost:3000/oauth2callback'. Please edit
your keyfile, and add a 'redirect_uris' section.`;

class SampleClient {
  constructor(options) {
    this._options = options || {scopes};

    // validate the redirectUri.  This is a frequent cause of confusion.
    if (!conf.redirectUri) {
      throw new Error(invalidRedirectUri);
    }

    const redirectUri = conf.redirectUri;
    const parts = new url.URL(redirectUri);

    // if (
    //   parts.port !== '3000' ||
    //   parts.hostname !== 'localhost' ||
    //   parts.pathname !== 'attendance/oauth2callback'
    // ) {
    //   throw new Error(invalidRedirectUri);
    // }

    // create an oAuth client to authorize the API call
    this.oAuth2Client = new google.auth.OAuth2(
      conf.client_id,
      conf.client_secret,
      conf.redirectUri,
    );
  }

  // Open an http server to accept the oauth callback. In this
  // simple example, the only request to our webserver is to
  // /oauth2callback?code=<code>
  async authenticate(scopes) {

    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });

      const server = http
        .createServer(async (req, res) => {
          try {
              // console.log('request : ', req);            
              // if (req.url.indexOf('attendance/oauth2callback') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
              // console.log('request : ', qs);
              res.end('Authentication successful! Please return to the console.');
              server.destroy();
              const {tokens} = await this.oAuth2Client.getToken(qs.get('code'));
              // console.log('request : ', tokens);
              this.oAuth2Client.credentials = tokens;
              resolve(this.oAuth2Client);
            // }
          } catch (e) {
            reject(e);
          }
        })
        .listen(3000, () => {
          // open the browser to the authorize url to start the workflow
          opn(this.authorizeUrl, {wait: false}).then(cp => cp.unref());
        });
      destroyer(server);
    });
  }
}


module.exports = new SampleClient();