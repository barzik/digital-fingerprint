'use strict';
class FingerPrintInit {
  constructor(lang = 'en') {
    this.lang = lang;
    new window.Fingerprint2({
      excludeAdBlock: true,
      excludeDoNotTrack: true,
      excludeIndexedDB: true
    }).get(this.testIfHashIsThere.bind(this));
  }

  testIfHashIsThere(hash) {
    if (!hash) { // test to see if user get hash. if not, print error.
      this.error = new Error('Fingerprint2 could not fetch hash.');
      throw this.error;
    } else {
      this.getName(hash);
    }
    document.getElementById('initHashInsertion').addEventListener('click', this.saveHash);
  }

  getName(hash) {
    let requestURL = `/api/${hash}`;
    fetch(requestURL, {})
      .then((response) => {
        if (response.status === 404) {
          // Thanks firefox for this mess!
          this.nameIsNotThere(hash);
          return Promise.reject();
        } else {
          return response.text();
        }
      })
      .then((name) => {
        document.getElementById('form-container').style = 'display: none;';
        document.getElementById('name-container').style = 'display: block;';
        document.getElementById('name-display').innerHTML = name;
      })
      .catch(() => { });
  }

  nameIsNotThere(hash) {
    document.getElementById('hash').value = hash;
  }

  saveHash() {
    let requestURL = '/api/';
    fetch(requestURL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ hash: document.getElementById('hash').value, name: document.getElementById('name').value })
    })
      .then(() => {
        document.getElementById('form-container').style = 'display: none;';
        document.getElementById('name-container').style = 'display: block;';
        document.getElementById('name-display').innerHTML = 'Try to refresh or open in another browser';
      });
  }
}

new FingerPrintInit();
