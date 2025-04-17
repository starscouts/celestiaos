window.switcherId = null;
window.switcherShown = false;
window.selectedSwitcherItem = 1;

let stackItems = stack.filter(i => !document.getElementById("window-" + i).classList.contains("window-ignore-switcher"));

window.addEventListener("keydown", (event) => {
    //console.log(event);
    if (!window.switcherId) return;
    stackItems = stack.filter(i => !document.getElementById("window-" + i).classList.contains("window-ignore-switcher"));

    if (event.key === "Tab" && switcherShown) {
        if (event.shiftKey) {
            window.selectedSwitcherItem--;

            if (window.selectedSwitcherItem < 0) {
                window.selectedSwitcherItem = stackItems.length - 1;
            }
        } else {
            window.selectedSwitcherItem++;

            if (window.selectedSwitcherItem >= stackItems.length) {
                window.selectedSwitcherItem = 0;
            }
        }
    }

    if (event.key === "Tab" && (event.altKey || event.metaKey) && !switcherShown) {
        window.selectedSwitcherItem = 1;
        CelestiaOS_WM_Stack.show(window.switcherId);
        window.switcherShown = true;
    }

    console.log(document.getElementById("window-" + switcherId + "-inner"));

    let index = -1;

    if (window.selectedSwitcherItem > stackItems.length) window.selectedSwitcherItem = 0;

    document.getElementById("window-" + switcherId + "-inner").innerHTML = stack.map((i) => {
        let win = document.getElementById("window-" + i);
        if (win.classList.contains("window-ignore-switcher")) return '';

        index++;
        return `
            <div class="switcher-item ${index === window.selectedSwitcherItem ? "switcher-item-active" : ""}">${document.getElementById("window-" + i + "-title").innerHTML}</div>
        `;
    }).join("");
});

window.addEventListener("keyup", (event) => {
    //console.log(event);
    if (!window.switcherShown) return;

    if (event.key === "Alt") {
        CelestiaOS_WM_Stack.hide(window.switcherId);
        window.switcherShown = false;
        CelestiaOS_WM_Stack.front(document.getElementById("window-" + stackItems[selectedSwitcherItem]));
    }
});