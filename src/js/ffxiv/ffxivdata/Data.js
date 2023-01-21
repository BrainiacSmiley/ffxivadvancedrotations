export default class Data {
  constructor(data) {
    this.data = data;
  }

  isGCDAction() {
    return (
      this.data["cooldown_group"] &&
      (this.data["cooldown_group"] === 58 || this.data["cooldown_group"] === 13)
    );
  }

  getId() {
    return this.data["id"];
  }
}
