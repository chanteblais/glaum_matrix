class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
    }

    show() {
        document.querySelector(this.popupElement).style.display = "block";
    }

    close() {
        document.querySelector(this.popupElement).style.display = "none";
    }
}
