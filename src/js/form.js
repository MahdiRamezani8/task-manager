'use strict'
class Form {
  #API = "https://todo-app-5f66b-default-rtdb.firebaseio.com/";
  #userData;
  #emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  #passRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  #rememberMe;
  #_isLoggedIn = false;

  constructor(form) {
    // selecting elements
    this.form = form;
    this.emailInput = form.querySelector(".username");
    this.passwordInput = form.querySelector(".password");
    this.rememberMeInput = form.querySelector(".rememberMe");
    this.loginBtn = form.querySelector(".login");
    this.passShowStatsEl = form.querySelector(".pass-show-stats");
    this.emailShowStatsEl = form.querySelector(".email-show-stats");
    this.formShowStatsEl = form.querySelector(".form-show-stats");
    // this._checkCookie();
    this._eventListener();
  }

  _checkCookie(){
    const rememberMeCookie = document.cookie.includes('rememberMe');
    rememberMeCookie && this._login();
    console.log(rememberMeCookie)
  };
  
  _eventListener() {
    // listening events
    this.form.addEventListener("submit", e => {
      e.preventDefault();
      this._inputValidation.bind(this)();
    });
  }

  _inputValidation() {
    // validating given data by user
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    const rememberMe = this.rememberMeInput.checked;
    const eValidat = this.#emailRegex.test(email);
    const pValidat = this.#passRegex.test(password);
    if (!eValidat)
      this._showError(this.emailShowStatsEl, "your email is not valid");
    else this._showError(this.emailShowStatsEl, "");

    // prettier-ignore
    if (!pValidat) this._showError(this.passShowStatsEl, "your password should contain (&*$#@) and (0-9) and (A-Z)");
      else this._showError(this.passShowStatsEl, "");
    if (eValidat && pValidat) {
      this.#userData = { email, password };
      this._userExistenceValidation.bind(this)();

      this.#rememberMe = rememberMe;
      console.log(this.#rememberMe);
    }
  }

  _showError(el, text) {
    // showing error to user
    el.innerHTML = text;
    el.classList.remove("suc");
    el.classList.add("err");
  }

  _showSuccess(el, text) {
    el.innerHTML = text;
    el.classList.remove("err");
    el.classList.add("suc");
  }

  async _userExistenceValidation() {
    // checking is user avalable in DB or not

    try {
      // getting data from DB
      const res = await fetch(`${this.#API}/users.json`);
      if (!res.ok) throw new Error("can`t get response");
      const data = await res.json();
      if (!data) throw new Error("this account is not in DB");

      // checking exitence
      for (const iterator of Object.entries(data)) {
        if (this.#userData.email === iterator[1].email) {
          this._login();
          this._showSuccess(this.formShowStatsEl, "user is valid  :)");
          return;
        } else {
          this._showError(this.formShowStatsEl, "user does not exits");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  _setCookie() {
    if (this.#rememberMe){
      const nowTime = new Date();
      nowTime.setTime(nowTime.getTime() + (2 * 24 * 60 * 60 * 1000));
      document.cookie = `rememberMe=${this.#rememberMe}; expires=${nowTime}`;
    }
  }

  _login() {
    this._setCookie();
    this.#_isLoggedIn = true;
    location.assign(`http://127.0.0.1:5500/app.html?isLoggedIn=${this.isLoggedIn}`)
  }

  get isLoggedIn() {
    return this.#_isLoggedIn;
  }
}

const form = new Form(document.querySelector(".form"));

// let isLoggedIn = form.isLoggedIn;
// console.log(isLoggedIn);
// export { isLoggedIn };
