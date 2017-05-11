(function (window) {
  'use strict';

  /**
   * Creates a new model
   * @constructor
   */
  function Model() {
    this.status = {
      value: '',
      validValues: ['beginning', 'running', 'ended'],
      subscribers: [],
    };

    this.whoseTurn = {
      value: '',
      validValues: ['player-one', 'player-two'],
      subscribers: [],
    };

    this.result = {
      value: '',
      validValues: ['player-one-won', 'player-two-won'],
      subscribers: [],
    };

    // 1 = human/computer, 2 = human/human
    this.gameType = {
      value: 0,
      validValues: [1, 2],
      subscribers: [],
    };

    // player one avatar
    this.playerOneAvatar = {
      value: '',
      validValues: ['X', 'O'],
      subscribers: [],
    };

    // player two avatar
    this.playerTwoAvatar = {
      value: '',
      validValues: ['X', 'O'],
      subscribers: [],
    };

    // player one score
    this.playerOneScore = {
      value: 0,
      validValues: [],
      subscribers: [],
    };

    // player two avatar
    this.playerTwoScore = {
      value: 0,
      validValues: [],
      subscribers: [],
    };
  }

  /**
   * @method subscribe
   * @description Registers new subscribers
   * @param {string} property - The string representation of the property to get notifications from
   * @param {Function} subscriber - Callback to the subscriber
   */
  Model.prototype.subscribe = function (property, subscriber) {
    if (this[property] && Array.isArray(this[property].subscribers) && typeof subscriber === 'function') {
      this[property].subscribers.push(subscriber);
    }
  };

  /**
   * @method setProperty
   * @description Updates or sets a given property with a given value
   * @param {string} property - The string representation of the property to update
   * @param {*} newValue - The value to update the property with
   */
  Model.prototype.setProperty = function (property, newValue) {
    if (!this[property] || typeof this[property] !== 'object') {
      console.error(`Property '${property} does not exist`);
      return;
    }

    if (arguments.length !== 2) {
      console.error('Called with less than the required arguments');
      return;
    }

    if (this[property].validValues.length > 0) {
      if (this[property].validValues.indexOf(newValue) < 0) {
        console.error(`Value '${newValue}' is not a valid value for property '${property}'`);
        return;
      }
    }

    if (newValue !== this[property].value) {
      this[property].value = newValue;
      this[property].subscribers.forEach((subscriber) => {
        subscriber(this[property].value);
      });
    }
  };

  Model.prototype.getProperty = function (property) {
    if (!this[property] || typeof this[property] !== 'object') {
      console.error(`Property '${property} does not exist`);
      return;
    }

    return this[property].value;
  };

  window.ttt = window.ttt || {};
  window.ttt.Model = Model;
})(window);
