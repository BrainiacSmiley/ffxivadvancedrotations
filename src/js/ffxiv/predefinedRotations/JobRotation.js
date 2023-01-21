export class JobRotation {
  /**
   * @param {String} name The name of this rotation.
   * @param {String} icon The icon url for this rotation.
   * @param {Number} jobId The icon url for this rotation.
   * @param {Number} lvl The icon url for this rotation.
   * @param {Array } ids The ids for this rotation.
   */
  constructor(name, icon, jobId, lvl, ids) {
    this.name = name;
    this.icon = icon;
    this.jobId = jobId;
    this.lvl = lvl;
    this.ids = ids;
  }

  /**
   * Gets the name for this rotation.
   * @returns {String}
   */
  getName() {
    return this.name;
  }

  /**
   * Gets the icon urls for this rotation.
   * @returns {Object}
   */
  getIcon() {
    const iconUrl = `https://xivapi.com/${this.icon}`;
    return { backgroundImage: `url(${iconUrl})` };
  }

  /**
   * Gets the structure converted ready for the dragged rotation representation.
   * @returns {{jobId: Number, lvl: Number, ids: Array}}
   */
  getDraggedRotation() {
    return {
      lvl: this.lvl,
      jobId: this.jobId,
      ids: this.ids,
    };
  }
}
