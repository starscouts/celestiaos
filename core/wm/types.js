window.CelestiaOS_WM_Types = {
    switcher: (id) => {
        window.switcherId = id;
    },
    demo: (id) => {
        CelestiaOS_WM_Stack.show(id);
    }
}