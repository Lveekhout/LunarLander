let lander
let world
let lc
let gpbec

window.onload = e => {
    lander = new Lander(document.getElementById('canvas'))
    lander.ready = e => {
        lc = new LanderController(lander)

        world = new World(lander)
        world.addAnimationCallbackCallback(() => gpbec.updateState())
        world.addAnimationCallbackCallback(() => document.getElementById('textarea').value = textarea.value = JSON.stringify(lander.getInfo(), null, 2))
        world.startAnimation()
    }
}

gpbec = new GamePadButtonEventController()
gpbec.onButtonAChanged = value => {
    if (value == 1) lander.activateMainThruster()
    else lander.deactivateMainThruster()
}
gpbec.onButtonXChanged = value => {
    if (value == 1) lc.thrust()
}
gpbec.onButtonPadLeftChanged = value => {
    if (value == 1) lc.manualOverrideLeftThruster()
    else lc.manualStopLeftThruster()
}
gpbec.onButtonPadRightChanged = value => {
    if (value == 1) lc.manualOverrideRightThruster()
    else lc.manualStopRightThruster()
}
gpbec.onTriggerRightChanged = value => {
    world.setScale(value * 30 + 20)
}

// window.addEventListener("keydown", e => {
//     switch (e.code) {
//         case 'ControlRight':
//             lander.activateMainThruster()
//             break
//         case 'ControlLeft':
//             lc.manualOverrideLeftThruster()
//             break
//         case 'AltLeft':
//             lc.manualOverrideRightThruster()
//             break
//         default:
//             console.log(e.code)
//     }
// })

// window.addEventListener("keyup", e => {
//     switch (e.code) {
//         case 'ControlRight':
//             lander.deactivateMainThruster()
//             break
//         case 'ControlLeft':
//             lc.manualStopLeftThruster()
//             break
//         case 'AltLeft':
//             lc.manualStopRightThruster()
//             break
//     }
// })
