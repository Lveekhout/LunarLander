let canvas
let ctx

let current
let frameReq

const gravity = 0//9.81 / 2 / 6

let scale = 15
let lander = new Image()
let rotate = [0, 1, 0]                 // [acc, speed, angle]
let landerAltitude = [-gravity, 0, 40] // [acc, speed, altitude in meters]
let landerLatitude = [0, 0, 0]       // [acc, speed, latitude in meters]
let mainThruster = 0

const draw = dtm => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height)

    const info = {
        alt: {
            acc: landerAltitude[0].toFixed(4),
            vel: landerAltitude[1].toFixed(4),
            pos: landerAltitude[2].toFixed(4)
        },
        lat: {
            acc: landerLatitude[0].toFixed(4),
            vel: landerLatitude[1].toFixed(4),
            pos: landerLatitude[2].toFixed(4)
        },
        rot: {
            acc: rotate[0].toFixed(4),
            vel: rotate[1].toFixed(4),
            agl: rotate[2].toFixed(4)
        },
        impact: {
            D: prediction()[0].toFixed(4),
            t: prediction()[1].toFixed(4)
        },
        framerate: {
            milliseconds: dtm.toFixed(4)
        }
    }
    document.getElementById("textarea").value = JSON.stringify(info, null, 2)

    {
        ctx.save()
        ctx.scale(scale, scale)
        ctx.translate(landerLatitude[2], -landerAltitude[2])
        ctx.scale(7.04 / lander.height, 7.04 / lander.height)
        ctx.rotate(-rotate[2])
        ctx.drawImage(lander, -lander.width / 2, -lander.height)
        ctx.restore()
    }

    ctx.restore()
}

const animate = milli => {
    const dtm = milli - current // DeltaTimeMilliseconds
    const dts = dtm / 1000      // DeltaTimeSeconds
    current = milli

    draw(dtm)

    frameReq = window.requestAnimationFrame(animate)

    rotate[2] += rotate[0] * Math.pow(dts, 2) + rotate[1] * dts
    rotate[1] += 2 * rotate[0] * dts

    const accAltitude = landerAltitude[0] + mainThruster * Math.cos(rotate[2])
    landerAltitude[2] += accAltitude * Math.pow(dts, 2) + landerAltitude[1] * dts
    landerAltitude[1] += 2 * accAltitude * dts

    const accLatitude = landerLatitude[0] - mainThruster * Math.sin(rotate[2])
    landerLatitude[2] += accLatitude * Math.pow(dts, 2) + landerLatitude[1] * dts
    landerLatitude[1] += 2 * accLatitude * dts

    if (landerAltitude[2] < 0) stopAnimation()
}

const initAnimate = milli => {
    current = milli
    frameReq = window.requestAnimationFrame(animate)
}

const startAnimation = () => {
    duur = performance.now()
    frameReq = window.requestAnimationFrame(initAnimate)
}

const stopAnimation = () => {
    console.log('duur = ' + (performance.now() - duur))
    window.cancelAnimationFrame(frameReq)
    document.getElementById("textarea").value = null
}

const thrust = () => {
    mainThruster = 2
    setTimeout(() => mainThruster = 0, 1000)
}

const prediction = () => {
    const accAltitude = landerAltitude[0] + mainThruster * Math.cos(rotate[2])
    const D = landerAltitude[1] * landerAltitude[1] - (4 * accAltitude * landerAltitude[2])
    const x1 = (-landerAltitude[1] - Math.sqrt(D)) / (2 * accAltitude)
    return [D, x1]
}

window.onload = e => {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    lander.src = "images/ApolloProgram_LunarModule.gif"
    lander.onload = l => {
        startAnimation()
    }
}

window.addEventListener("keydown", e => {
    switch (e.code) {
        case 'ControlRight':
            mainThruster = 2
            break
        case 'ControlLeft':
            rotate[0] = 0.5
            break
        case 'MetaLeft':
            rotate[0] = -0.5
            break
        default:
            console.log(e.code)
    }
})

window.addEventListener("keyup", e => {
    switch (e.code) {
        case 'ControlRight':
            mainThruster = 0
            break
        case 'ControlLeft':
            rotate[0] = 0
            break
        case 'MetaLeft':
            rotate[0] = 0
            break
    }
})
