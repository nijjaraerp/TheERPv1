(function () {
  const state = {
    highestZ: 10,
    windows: new Map(),
    taskSwitcher: null,
    taskTemplate: null,
    dock: null,
  };

  function init(options = {}) {
    document.body.classList.add("nijjara-body");
    state.taskSwitcher = document.querySelector("#task-switcher");
    state.taskTemplate = document.querySelector("#task-thumb-template");
    state.dock = document.querySelector("#neural-dock");

    if (options.autoClock !== false) {
      startClock(options.clockSelector || "#date-time");
    }

    if (state.dock) {
      applyAutoHide(state.dock, "bottom", "-85px", "10px");
    }

    const switcher = document.querySelector("#task-switcher");
    if (switcher) {
      applyAutoHide(switcher, "top", "-55px", "0");
    }

    registerWindowControls();
  }

  function applyAutoHide(element, prop, hiddenValue, visibleValue) {
    if (!element) return;
    element.dataset.hiddenValue = hiddenValue;
    element.dataset.visibleValue = visibleValue;
    element.style[prop] = hiddenValue;
    element.addEventListener("mouseenter", () => {
      element.style[prop] = visibleValue;
    });
    element.addEventListener("mouseleave", () => {
      element.style[prop] = hiddenValue;
    });
  }

  function startClock(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString("ar-EG-u-nu-latn", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const time = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      el.textContent = `${date} | ${time}`;
    };
    update();
    setInterval(update, 1000);
  }

  function bootSequence(messages, logSelector, onReady) {
    const logEl =
      typeof logSelector === "string"
        ? document.querySelector(logSelector)
        : logSelector;
    if (!logEl) return;
    let index = 0;

    const step = () => {
      if (index < messages.length) {
        const p = document.createElement("p");
        p.textContent = `> ${messages[index]}`;
        logEl.appendChild(p);
        logEl.scrollTop = logEl.scrollHeight;
        index += 1;
        setTimeout(step, 100 + Math.random() * 300);
      } else if (typeof onReady === "function") {
        onReady();
      }
    };

    step();
  }

  function showToast(
    message,
    type = "info",
    containerSelector = "#toastContainer"
  ) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  function registerWindowControls() {
    document.querySelectorAll(".app-window").forEach(registerWindow);
  }

  function registerWindow(windowEl) {
    if (!windowEl || state.windows.has(windowEl.id)) return;
    const windowId =
      windowEl.id ||
      `window-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    windowEl.id = windowId;
    state.windows.set(windowId, windowEl);

    const header = windowEl.querySelector(".window-header");
    if (header) {
      makeDraggable(header, windowEl);
    }

    const minBtn = windowEl.querySelector(".btn-min");
    const maxBtn = windowEl.querySelector(".btn-max");
    const closeBtn = windowEl.querySelector(".btn-close");

    minBtn?.addEventListener("click", () => minimizeWindow(windowEl));
    maxBtn?.addEventListener("click", (e) =>
      toggleMaximize(windowEl, e.currentTarget)
    );
    closeBtn?.addEventListener("click", () => closeWindow(windowEl));

    windowEl.addEventListener("mousedown", () => bringToFront(windowEl));

    addTaskThumb(
      windowEl.dataset.moduleId || "generic",
      windowId,
      windowEl.querySelector(".window-title")?.textContent || "Window"
    );
    bringToFront(windowEl);
  }

  function makeDraggable(handle, element) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    let dragging = false;

    const dragMouseDown = (e) => {
      if (e.target.closest("button")) return;
      dragging = false;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e) => {
      e.preventDefault();
      dragging = true;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = `${element.offsetTop - pos2}px`;
      element.style.left = `${element.offsetLeft - pos1}px`;
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
      if (!dragging) {
        bringToFront(element);
      }
    };

    handle.onmousedown = dragMouseDown;
  }

  function bringToFront(windowEl) {
    state.highestZ += 1;
    windowEl.style.zIndex = state.highestZ;
    windowEl.style.display = "block";
    const thumb = document.querySelector(
      `.task-thumb[data-window-id="${windowEl.id}"]`
    );
    thumb?.classList.remove("minimized");
  }

  function minimizeWindow(windowEl) {
    windowEl.style.display = "none";
    const thumb = document.querySelector(
      `.task-thumb[data-window-id="${windowEl.id}"]`
    );
    thumb?.classList.add("minimized");
  }

  function toggleMaximize(windowEl, btn) {
    const icon = btn?.querySelector("svg use");
    if (windowEl.dataset.isMaximized === "true") {
      windowEl.style.top = windowEl.dataset.oldTop;
      windowEl.style.left = windowEl.dataset.oldLeft;
      windowEl.style.width = windowEl.dataset.oldWidth;
      windowEl.style.height = windowEl.dataset.oldHeight;
      windowEl.dataset.isMaximized = "false";
      icon?.setAttribute("href", "#icon-maximize");
    } else {
      windowEl.dataset.oldTop = windowEl.style.top || "0px";
      windowEl.dataset.oldLeft = windowEl.style.left || "0px";
      windowEl.dataset.oldWidth =
        windowEl.style.width || `${windowEl.offsetWidth}px`;
      windowEl.dataset.oldHeight =
        windowEl.style.height || `${windowEl.offsetHeight}px`;
      windowEl.style.top = "0";
      windowEl.style.left = "0";
      windowEl.style.width = "100vw";
      windowEl.style.height = "100vh";
      windowEl.dataset.isMaximized = "true";
      icon?.setAttribute("href", "#icon-restore");
    }
  }

  function closeWindow(windowEl) {
    const thumb = document.querySelector(
      `.task-thumb[data-window-id="${windowEl.id}"]`
    );
    thumb?.remove();
    state.windows.delete(windowEl.id);
    windowEl.remove();
  }

  function addTaskThumb(moduleId, windowId, title) {
    if (!state.taskSwitcher || !state.taskTemplate) return;
    if (state.taskSwitcher.querySelector(`[data-window-id="${windowId}"]`))
      return;
    const thumb = state.taskTemplate.content
      .cloneNode(true)
      .querySelector(".task-thumb");
    thumb.dataset.windowId = windowId;
    const useEl = thumb.querySelector("svg use");
    if (useEl) {
      const iconMap = {
        hrm: "#icon-hrm",
        prj: "#icon-prj",
        fin: "#icon-fin",
        sys: "#icon-sys",
      };
      useEl.setAttribute("href", iconMap[moduleId] || "#icon-sys");
    }
    const titleEl = thumb.querySelector(".task-thumb-title");
    if (titleEl) {
      titleEl.textContent =
        title.length > 12 ? `${title.slice(0, 9)}...` : title;
    }
    thumb.addEventListener("click", () => {
      const windowEl = document.getElementById(windowId);
      if (windowEl) {
        windowEl.style.display = "block";
        bringToFront(windowEl);
      }
    });
    state.taskSwitcher.appendChild(thumb);
  }

  function dockActionFactory(action) {
    const event = new CustomEvent("dock-action", { detail: action });
    window.dispatchEvent(event);
  }

  function wireDockButtons() {
    const mapping = [
      ["#app-grid", "grid"],
      ["#app-cascade", "cascade"],
      ["#app-minimize-all", "minimize"],
      ["#app-expand-all", "expand"],
    ];
    mapping.forEach(([selector, action]) => {
      const el = document.querySelector(selector);
      el?.addEventListener("click", () => dockActionFactory(action));
    });
  }

  document.addEventListener("DOMContentLoaded", wireDockButtons);

  window.NijjaraShell = {
    init,
    bootSequence,
    showToast,
    registerWindow,
  };
})();
