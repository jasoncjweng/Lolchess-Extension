const rankInfoElement = document.getElementById('rank_info');
const riotProxyUrl = 'http://localhost:3000/tft-data'
const dbProxyUrl = 'http://localhost:3000/save-user-data'
const riotButton = document.querySelector('.riotButton');
const twitchButton = document.querySelector('.twitchButton')
const twitchClientId = 'dip323kti43glhzrsneqp87z0aws4j'
const twitchRedirectUri = 'https://defgdebfmdmnfkeinppfglhfpkelpnco.chromiumapp.org/'
const twitchOAuth = document.getElementById('twitchOAuth')
const twitchScopes = 'openid'

document.addEventListener('DOMContentLoaded', function () {
    twitchButton.addEventListener('click', function() {
        console.log('twitch button')
        authorizeTwitch()
        addUser()
    });
    
    riotButton.addEventListener('click', function() {
        console.log('riot button')
        authorizeRiot()
        addUser()
    })

    fetchTftRank()
    checkAuthorized()
});

function checkAuthorized() {
    chrome.storage.local.get("twitchIdToken").then((result) => {
        if (result.twitchIdToken != null && document.querySelector('.twitchButton')) {
            const check = document.createElement('img')
            check.src = 'images/check.png'
            check.setAttribute('width', '20');
            document.querySelector('.twitchButton').replaceWith(check)
        }
    })
    chrome.storage.local.get("riotId").then((result) => {
        if (result.riotId != null && document.querySelector('.riotButton')) {
            const check = document.createElement('img')
            check.src = 'images/check.png'
            check.setAttribute('width', '20');
            document.querySelector('.riotButton').replaceWith(check)
        }
    })    
}

function addUser() {
    chrome.storage.local.get(["twitchIdToken","riotId"]).then((result) => {
        if (result.twitchIdToken != null && result.riotId != null){
            fetch(dbProxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result),
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log('response failed')
                    throw new Error('Unable to send user data');
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error sending user data.', error);
            });
        }
    })
}

function fetchTftRank() {
    fetch(riotProxyUrl)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('response failed')
                throw new Error('Unable to fetch TFT rank data.');
            }
        })
        .then(data => {
            rankInfoElement.textContent = data;
        })
        .catch(error => {
            console.error(error);
            rankInfoElement.textContent = 'Error fetching TFT rank data.';
        });
}

function authorizeTwitch() { //add state string? don't put in extension for security?
    const twitchOAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientId}&redirect_uri=${encodeURIComponent(twitchRedirectUri)}&response_type=token+id_token&scope=${encodeURIComponent(twitchScopes)}`;
    chrome.runtime.sendMessage({type: "getAuthToken", twitchOAuthUrl}, function(response) {
        const url = new URL(response.replace('#','?'));
        const searchParams = new URLSearchParams(url.search);
        const idToken = searchParams.get('id_token');
        chrome.storage.local.set({'twitchIdToken': idToken},() => {
            checkAuthorized()
        })
        const username = JSON.parse(atob(idToken.split('.')[1])).preferred_username
      });
}

function authorizeRiot() {
    const riotId = document.getElementById('RiotTextBox');
    chrome.storage.local.set({'riotId': riotId.value},() => {
        checkAuthorized()
    })
}
