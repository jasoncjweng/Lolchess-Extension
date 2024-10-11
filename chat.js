function observe() {
  const chatContainer = document.querySelector('.right-column .stream-chat');
  if (chatContainer) {
    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(async (node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.value == 'chat-line__message') {
              console.log(node.querySelector('.text-fragment'))
              // node.querySelector('.text-fragment').innerHTML = "HandsUp"
              let messageContainer = node.querySelector('.chat-line__username-container')
              messageContainer = messageContainer.firstChild
              let twitchUsername = node.getAttribute('data-a-user')

              // twitchusername -> riotuser, rank
              const data = await fetchTftRank(twitchUsername)
              console.log(data)
              const tier = data.tier.toLowerCase()
              const riotUsername = data.summonerName
              console.log(twitchUsername, riotUsername, tier)

              let lcdiv = document.createElement('div')
              lcdiv.setAttribute('class', 'LolchessButton kFXyOc')
              lcdiv.style.display = 'inline !important'

              let lcbutton = document.createElement('button')
              lcbutton.setAttribute('data-a-target', 'chat-badge')
              lcbutton.setAttribute('onclick', `window.open('https://lolchess.gg/profile/na/${riotUsername}')`)
              
              let lcimage = document.createElement('img')
              lcimage.alt = 'Lolchess'
              lcimage.class = 'chat-badge'
              lcimage.src = chrome.runtime.getURL(`images/${tier}18.png`)

              lcbutton.appendChild(lcimage)
              lcdiv.appendChild(lcbutton)
              messageContainer.insertBefore(lcdiv, messageContainer.childNodes[0])
            }
          });
        }
      });
    });

    observer.observe(chatContainer, {
      childList: true,
      subtree: true,
    });
  }
}

function fetchTftRank(username) {
  return new Promise((resolve,reject)=>{
    fetch(`http://localhost:3000/tft-users/${username}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('response failed')
                reject('Unable to fetch TFT rank data.');
            }
        })
        .then(data => {
          console.log('data',data)
          resolve(data);
        })
        .catch(error => {
            console.error(error);
            reject('Error fetching TFT rank data.');
        });
  })
}

observe();