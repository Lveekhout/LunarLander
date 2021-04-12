function Lander(canvas, textarea) {
    const ctx = canvas.getContext('2d')

    let gravity = 0
    let scale = 20
    let lander = new Image()
    let cm = [291, 150]                    // center of mass
    this.rotate = [0, 0]                   // [speed, angle]
    let landerAltitude = [-gravity, 0, 30] // [acc, speed, altitude in meters]
    let landerLatitude = [0, 0, 0]         // [acc, speed, latitude in meters]
    let lunarscale

    let mainThruster = 0
    let leftThruster = 0
    let rightThruster = 0

    this.draw = () => {
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
                acc: (rightThruster-leftThruster).toFixed(4),
                vel: this.rotate[0].toFixed(4),
                agl: this.rotate[1].toFixed(4)
            },
            impact: {
                D: prediction()[0].toFixed(4),
                t: prediction()[1].toFixed(4)
            }
        }
        textarea.value = JSON.stringify(info, null, 2)

        {
            ctx.save()
            ctx.scale(scale, scale)
            ctx.translate(landerLatitude[2], -landerAltitude[2])
            ctx.rotate(-this.rotate[1])
            if (mainThruster != 0) {
                ctx.beginPath()
                ctx.ellipse(0, cm[1] * lunarscale, 30 * lunarscale, 100 * lunarscale, 0, 0, Math.PI * 2)
                ctx.fillStyle = "red"
                ctx.fill()
            }
            if (leftThruster != 0) {
                ctx.beginPath()
                ctx.ellipse(-150 * lunarscale, (-300 + cm[1]) * lunarscale, 50 * lunarscale, 20 * lunarscale, 0, 0, Math.PI * 2)
                ctx.fillStyle = "red"
                ctx.fill()
            }
            if (rightThruster != 0) {
                ctx.beginPath()
                ctx.ellipse(150 * lunarscale, (-300 + cm[1]) * lunarscale, 50 * lunarscale, 20 * lunarscale, 0, 0, Math.PI * 2)
                ctx.fillStyle = "red"
                ctx.fill()
            }
            ctx.scale(lunarscale, lunarscale)
            ctx.drawImage(lander, -cm[0], -lander.height+cm[1])
            ctx.restore()
        }

        ctx.restore()
    }
    this.update = dts => {
        if (landerAltitude[2] < 0) {
            if (this.belowSurface) this.belowSurface()
            return
        }

        this.rotate[1] += (rightThruster-leftThruster) * Math.pow(dts, 2) + this.rotate[0] * dts
        this.rotate[0] += 2 * (rightThruster-leftThruster) * dts

        // if (Math.abs(this.rotate[1]) > 0.03) this.thrust()
        // if (Math.abs(this.rotate[0]) > 0.0003 || Math.abs(this.rotate[1]) > 0.03) this.thrust2()

        landerAltitude[0] = -gravity + mainThruster * Math.cos(this.rotate[1])
        landerAltitude[2] += landerAltitude[0] * Math.pow(dts, 2) + landerAltitude[1] * dts
        landerAltitude[1] += 2 * landerAltitude[0] * dts

        const accLatitude = landerLatitude[0] - mainThruster * Math.sin(this.rotate[1])
        landerLatitude[2] += accLatitude * Math.pow(dts, 2) + landerLatitude[1] * dts
        landerLatitude[1] += 2 * accLatitude * dts
    }

    const prediction = () => {
        const accAltitude = -gravity + mainThruster * Math.cos(this.rotate[1])
        const D = landerAltitude[1] * landerAltitude[1] - (4 * accAltitude * landerAltitude[2])
        const x1 = (-landerAltitude[1] - Math.sqrt(D)) / (2 * accAltitude)
        return [D, x1]
    }

    this.activateMainThruster = () => mainThruster = 2
    this.deactivateMainThruster = () => mainThruster = 0
    this.activateLeftThruster = () => leftThruster = .5
    this.deactivateLeftThruster = () => leftThruster = 0
    this.activateRightThruster = () => rightThruster = .5
    this.deactivateRightThruster = () => rightThruster = 0

    this.setGravity = value => {
        gravity = value
    }

    this.belowSurface
    this.ready

    lander.src = "images/ApolloProgram_LunarModule.gif"
    lander.onload = l => {
        lunarscale = 7.04 / lander.height
        console.log(`lunarscale: ${lunarscale}`)
        if (this.ready) this.ready(new Event("ready"))
    }
}
