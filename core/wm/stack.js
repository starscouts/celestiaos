let stack = [];
let windows = [];

window.CelestiaOS_WM_Stack = {
    front: (win) => {
        let id = win.getAttribute("data-window-id");

        stack = [
            ...stack.filter(i => i === id),
            ...stack.filter(i => i !== id)
        ]

        CelestiaOS_WM_Stack.refresh();
    },

    refresh: () => {
        for (let index in stack) {
            index = parseInt(index);
            let id = stack[index];

            let win = document.getElementById("window-" + id);
            win.style.zIndex = (stack.length - index).toString();

            if (index === 0) {
                win.classList.add("window-focused");
            } else {
                win.classList.remove("window-focused");
            }
        }
    },

    create: (width, height, minWidth, minHeight, resizable, initialX, initialY, title, frame, filler, ignoreSwitcher) => {
        if (!width) width = 256;
        if (!height) height = 256;
        if (!minWidth) minWidth = 0;
        if (!minHeight) minHeight = 0;
        if (!title) title = "Window";
        if (!initialX) initialX = window.innerWidth / 2 - width / 2;
        if (!initialY) initialY = window.innerHeight / 2 - height / 2;
        if (!filler) filler = () => {};

        if (typeof resizable !== "boolean") resizable = true;
        if (typeof frame !== "boolean") frame = true;

        width = (width + 4) + "px";
        height = (height + (frame ? 34 : 4)) + "px";
        initialX = initialX + "px";
        initialY = initialY + "px";

        let id = require('uuid-v4')();

        html = `<div class="window window-resizable ${!frame ? 'window-frameless' : ''} ${ignoreSwitcher ? 'window-ignore-switcher' : ''}" data-window-id="${id}" onmousedown="CelestiaOS_WM_Stack.front(this)" id="window-${id}" data-window-minwidth="${minWidth}" data-window-minheight="${minHeight}" style="width: ${width}; height: ${height}; top: ${initialY}; left: ${initialX};">
            <div class="window-titlebar" onmousedown="CelestiaOS_WM_Drag.startMoving(this.parentElement,'container',event);" onmouseup="CelestiaOS_WM_Drag.stopMoving('container');">
                <span class="window-titlebar-title" id="window-${id}-title">${title.replaceAll(">", "&gt;").replaceAll("<", "&lt;")}</span><a class="window-close" onclick="CelestiaOS_WM_Stack.destroy(this.parentElement.parentElement)"><img class="window-close-icon" src="../assets/wm/close.svg"></a>
            </div>
    
            <div class="resizers" ${!resizable ? 'style="pointer-events: none;"' : ''}>
                <div class="resizer top-left"></div>
                <div class="resizer top-right"></div>
                <div class="resizer bottom-left"></div>
                <div class="resizer bottom-right"></div>
            </div>
            
            <div class="window-inner" id="window-${id}-inner"></div>
        </div>`;

        let el = document.createElement("div");
        el.id = "temporary-window-" + id;

        document.getElementById("container").appendChild(el);
        document.getElementById("temporary-window-" + id).outerHTML = html;
        windows.push(id);

        if (resizable) {
            makeResizableDiv("#window-" + id);
        }

        document.getElementById("window-" + id).style.display = "none";
        filler(id);
    },

    show: (id) => {
        if (stack.indexOf(id) > -1) return;
        document.getElementById("window-" + id).style.display = "";
        stack.push(id);
        CelestiaOS_WM_Stack.front(document.getElementById("window-" + id));
    },

    hide: (id) => {
        if (stack.indexOf(id) === -1) return;
        document.getElementById("window-" + id).style.display = "none";
        stack.splice(stack.indexOf(id), 1);
        CelestiaOS_WM_Stack.refresh();
    },

    destroy: (win) => {
        let id = win.getAttribute("data-window-id");
        if (stack.indexOf(id) > -1) stack.splice(stack.indexOf(id), 1);
        windows.splice(windows.indexOf(id), 1);
        CelestiaOS_WM_Stack.refresh();
        document.getElementById("window-" + id).outerHTML = "";
    }
}

CelestiaOS_WM_Stack.refresh();