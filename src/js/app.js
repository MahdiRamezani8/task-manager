class Modal {
  constructor(openBtn, modal) {
    this._modal = modal;
    this._openModalBtn = openBtn;
    this._closeModalBtn = modal.querySelector(".fa-close");
    this._eventListener();
  }

  _eventListener() {
    this._openModalBtn.addEventListener("click", this._openModal.bind(this));
    this._closeModalBtn.addEventListener("click", this._closeModal.bind(this));
  }

  _openModal() {
    this._modal.classList.add("modal--active");
  }

  _closeModal() {
    this._modal.classList.remove("modal--active");
  }
}

const modal = new Modal(
  document.querySelector(".open-modal"),
  document.querySelector(".modal")
);
