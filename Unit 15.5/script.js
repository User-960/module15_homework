const wsUrl = "wss://echo-ws-service.herokuapp.com";

const btnSend = document.querySelector('.btn-submit');
const output = document.querySelector('.output');
const btnGeolocation = document.querySelector('.btn-geolocation');

let websocket;

function writeToScreenClient(message) {
  let preClient = document.createElement('p');
  preClient.classList.add('field-text');
  preClient.classList.add('field-client');
  preClient.innerHTML = message;
  output.appendChild(preClient);
}

function writeToScreenServer(message) {
  let preServer = document.createElement('p');
  preServer.classList.add('field-text');
  preServer.classList.add('field-server');
  preServer.innerHTML = message;
  output.appendChild(preServer);
}

btnSend.addEventListener('click', () => {
  websocket = new WebSocket('wss://echo-ws-service.herokuapp.com/');

  websocket.onopen = function(evt) {
    console.log('CONNECTED');
    const message = document.getElementById('chat-input').value;

    if (!message) {
      document.getElementById('chat-input').style.borderColor = 'red';
      return
    } else {
      document.getElementById('chat-input').style.borderColor = 'rgb(150, 195, 255)';
      writeToScreenClient(message);
      websocket.send(message);
    }
    
  }

  websocket.onclose = function(evt) {
    console.log('DISCONNECTED');
    writeToScreenClient(
      '<span style="color: red;text-transform: uppercase;">Не в сети</span>'
    );

    websocket.close();
    websocket = null;
  }

  websocket.onmessage = function(evt) {
    writeToScreenServer(
      '<span>Cервер: ' + evt.data+'</span>'
    );
  }

  websocket.onerror = function (evt) {
    writeToScreenServer(
      '<span style="color:red;text-transform: uppercase;">ERROR</span>'
    );
  }
});



let latitude;
let longitude;

function writeClientGeoLink(message) {
  let preClientLink = document.createElement('a');
  preClientLink.classList.add('field-text');
  preClientLink.classList.add('field-client');
  preClientLink.href = `https://www.openstreetmap.org/#map=10/${latitude}/${longitude}`;
  preClientLink.innerHTML = message;
  output.appendChild(preClientLink);
}

const errorGeolocation = () => {
  writeToScreenClient("Невозможно получить ваше местоположение");
}

const successGeolocation = (position) => {
  console.log('position', position);
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  writeClientGeoLink('Гео-локация');
}

btnGeolocation.addEventListener('click', () => {
  latitude = '';
  longitude = '';
  preClientLink = null;

  if (!navigator.geolocation) {
    writeToScreenServer("Geolocation не поддерживается вашим браузером");
  } else {
    writeToScreenServer("Определение местоположения...");
    navigator.geolocation.getCurrentPosition(successGeolocation, errorGeolocation);
  }
});