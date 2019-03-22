const fs = require('fs');
const readline = require('readline');

const {google} = require('googleapis');
const sampleClient = require('../config/client');

// initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: sampleClient.oAuth2Client,
});


// very basic example of uploading a video to youtube
async function runSample() {
  // const fileSize = fs.statSync(fileName).size;

  const res = await youtube.liveBroadcasts.insert(
    {
      part: 'id,snippet,status',
      notifySubscribers: true,
      requestBody: {
        snippet: {
          title: 'Node.js YouTube Live STREAM Test',
          description: 'Testing YouTube Live STREAM via Google APIs Node.js Client',
          scheduledStartTime: '2019-02-20T19:20:30.45+05:30',	
        },
        status: {
          privacyStatus: 'public',
        },
      },
    }
  );




  const res1 = await youtube.liveStreams.insert(
    {
      part: 'id,snippet,status,cdn,contentDetails',
      kind: "youtube#liveStream",
      etag: res.data.etag,
      id: res.data.id,
      notifySubscribers: true,
      requestBody: {
        snippet: {
          title: 'Node.js YouTube Live STREAM Test',
        },
        cdn: {
          format: '480p',
          ingestionType: 'rtmp',
        },
      },
    }
  );




  console.log('broadcast id : ...', res.data.id);
  console.log('stream id : ...', res1.data.id);
  
  const res2 = await youtube.liveBroadcasts.bind(
    {
      part: 'id, snippet, contentDetails, status',
      id: res.data.id,
      streamId: res1.data.id,
      // notifySubscribers: true,
      // requestBody: {
      //   snippet: {
      //     title: 'Node.js YouTube Live STREAM Test',
      //   },
      //   cdn: {
      //     format: '480p',
      //     ingestionType: 'rtmp',
      //   },
      // },
    }
  );


  console.log('\n\n');
  // console.log(res.data);
  // console.log(res1.data);
  console.log('Bind Return : ... #', res2.data);
  return res2.data;
}



const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube'
];




if (module === require.main) {
  // const fileName = process.argv[2];
  sampleClient
    .authenticate(scopes)
    .then(() => runSample())
    .catch(console.error);
}



module.exports = {
  runSample,
  client: sampleClient.oAuth2Client,
};