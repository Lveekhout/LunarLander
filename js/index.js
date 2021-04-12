let lander
let world
let lc

window.onload = e => {
    lander = new Lander(document.getElementById('canvas'), document.getElementById('textarea'))
    lander.ready = e => {
        lc = new LanderController(lander)
        world = new World(lander)
        world.startAnimation()
    }
}

window.addEventListener("keydown", e => {
    switch (e.code) {
        case 'ControlRight':
            lander.activateMainThruster()
            break
        case 'ControlLeft':
            lc.manualOverrideLeftThruster()
            break
        case 'MetaLeft':
            lc.manualOverrideRightThruster()
            break
        default:
            console.log(e.code)
    }
})

window.addEventListener("keyup", e => {
    switch (e.code) {
        case 'ControlRight':
            lander.deactivateMainThruster()
            break
        case 'ControlLeft':
            lc.manualStopLeftThruster()
            break
        case 'MetaLeft':
            lc.manualStopRightThruster()
            break
    }
})
