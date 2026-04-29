const https = require('https');

const ids = [
  '1511707171634-5f897ff02aa9',
  '1598327105666-5b89351aff97',
  '1512941937669-90a1b58e7e9c',
  '1580910051074-3eb694886f94',
  '1592750475338-74b7b21085ab',
  '1605236453806-6ff36851218e',
  '1616348436168-de43ad0db179',
  '1510557880182-3d4d3cba35a5',
  '1591337676887-a217a6970a8a',
  '1601784551446-20c9e07cdbc3'
];

async function testUrl(id) {
  return new Promise((resolve) => {
    https.get(`https://images.unsplash.com/photo-${id}?q=80&w=800`, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', () => resolve({ id, status: 500 }));
  });
}

async function run() {
  for (let id of ids) {
    const res = await testUrl(id);
    console.log(`photo-${res.id}: ${res.status}`);
  }
}
run();
