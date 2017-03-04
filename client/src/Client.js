import $ from 'jquery';

function getSession(cb) {
  // TODO: Figure out why fetch API doesn't seem to be storing cookies in
  //  browser correctly
  // return fetch(`api/test`, {
  //   accept: 'application/json',
  //   credentials: 'same-origin'
  // }).then(checkStatus)
  //   .then(parseJSON)
  //   .then(cb);
  return $.ajax({
      type: 'GET',
      url: '/api/session',
    })
    .done((data, textStatus, jqXHR) => {
      cb();
    })
}

function getGame(gameId, cb) {
  return fetch(`/api/game/${gameId}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

const Client = {
  getGame,
  getSession
};
export default Client;