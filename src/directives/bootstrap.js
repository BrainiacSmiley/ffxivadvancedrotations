import { Popover, Tooltip } from "bootstrap";
import $ from "jquery";

const myDefaultAllowList = Tooltip.Default.allowList;
// To allow table elements
myDefaultAllowList.button = [/^data-v-[a-f0-9]+/];
const popoverConfig = {
  customClass: "ffxivadvancedrotation-black-popover",
  html: true,
  title: (el) => {
    const title = document.getElementsByClassName("popover-header");
    if (title.length > 0) {
      return title[0].innerHTML;
    }
    if ($(el).data("bs-title")) {
      return $(el).data("bs-title");
    } else {
      return el.title;
    }
  },
  content: () => {
    const content = document.getElementsByClassName("popover-body");
    if (content.length > 0) {
      return content[0].innerHTML;
    }
    return "";
  },
};
const tooltipConfig = {
  customClass: "ffxivadvancedrotation-black-tooltip",
  html: true,
  title: (el) => {
    const title = document.getElementsByClassName("tooltip-header");
    if (title.length > 0) {
      return title[0].innerHTML;
    }
    if ($(el).data("bs-title")) {
      return $(el).data("bs-title");
    } else {
      return el.title;
    }
  },
  content: () => {
    const content = document.getElementsByClassName("tooltip-body");
    if (content.length > 0) {
      return content[0].innerHTML;
    }
    return "";
  },
};

function registerPopoverButtons(el) {
  el.addEventListener("shown.bs.popover", () => {
    $(".popover-ok", ".popover").on("click", () => {
      $("#deleteActualRotation", "#popoverHiddenElements").click();
      Popover.getInstance($("#deleteRotation")).hide();
    });
    $(".popover-cancel").on("click", () => {
      Popover.getInstance($("#deleteRotation")).hide();
    });
  });
  el.addEventListener("hidden.bs.popover", () => {
    $(".popover-ok", ".popover").off("click");
    $(".popover-cancel").off("click");
  });
}

export const popover = {
  mounted(el) {
    new Popover(el, popoverConfig);
    registerPopoverButtons(el);
  },
};

export const tooltip = {
  mounted(el) {
    new Tooltip(el, tooltipConfig);
  },
};

export const tooltipPopover = {
  mounted(el) {
    new Tooltip(el, tooltipConfig);
    el.addEventListener("shown.bs.tooltip", () => {
      $(el).on("click", () => {
        $(el).off("click");
        $(el).tooltip("dispose");
        const popover = new Popover(el, popoverConfig);
        registerPopoverButtons(el);
        const handleHiddenBsPopoverEvent = () => {
          el.removeEventListener(
            "hidden.bs.popover",
            handleHiddenBsPopoverEvent
          );
          $(el).popover("dispose");
          new Tooltip(el, tooltipConfig);
        };
        el.addEventListener("hidden.bs.popover", handleHiddenBsPopoverEvent);
        popover.show();
      });
    });
    el.addEventListener("hidden.bs.tooltip", () => {
      $(el).off("click");
    });
  },
};
