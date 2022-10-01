function LanderController(lander) {
    let autoThrustActive = false
    let request

    this.manualOverrideLeftThruster = () => {
        autoThrustActive = true
        if (request) {
            clearTimeout(request)
            request = undefined
            lander.deactivateRightThruster()
        }
        lander.activateLeftThruster()
    }
    this.manualOverrideRightThruster = () => {
        autoThrustActive = true
        if (request) {
            clearTimeout(request)
            request = undefined
            lander.deactivateLeftThruster()
        }
        lander.activateRightThruster()
    }
    this.manualStopLeftThruster = () => {
        autoThrustActive = false
        lander.deactivateLeftThruster()
    }
    this.manualStopRightThruster = () => {
        autoThrustActive = false
        lander.deactivateRightThruster()
    }

    // a*x*x+b*x+c
    // a*x*x+b*x+(b*b/(8*a))+(c/2)
    // -a*x*x
    this.thrust = goal => {
        if (autoThrustActive) return
        if (!goal) goal = 0
        if (lander.rotate[1]-goal > 0) {
            const c_ = Math.pow(lander.rotate[0], 2) / (8 * -.5) + (lander.rotate[1]-goal) / 2
            const D = Math.pow(lander.rotate[0], 2) - (4 * -.5 * c_)
            const t1 = (-lander.rotate[0] - Math.sqrt(D)) / (2 * -.5)
            if (t1>0) {
                const speedt1 = 2 * -.5 * t1 + lander.rotate[0]
                const t2 = speedt1 / (2 * .5)
                timedLeftThruster(t1 * 1000, -t2 * 1000)
            } else console.log('not yet implemented')
        } else if (lander.rotate[1]-goal < 0) {
            const c_ = Math.pow(lander.rotate[0], 2) / (8 * .5) + (lander.rotate[1]-goal) / 2
            const D = Math.pow(lander.rotate[0], 2) - (4 * .5 * c_)
            const t1 = (-lander.rotate[0] + Math.sqrt(D)) / (2 * .5)
            if (t1>0) {
                const speedt1 = 2 * .5 * t1 + lander.rotate[0]
                const t2 = speedt1 / (2 * -.5)
                timedRightThruster(t1 * 1000, -t2 * 1000)
            } else console.log('not yet implemented')
        }

    }

    const timedLeftThruster = (right, zero) => {
        autoThrustActive = true
        lander.activateLeftThruster()
        request = setTimeout(() => {
            lander.deactivateLeftThruster()
            lander.activateRightThruster()
            request = setTimeout(() => {
                lander.deactivateRightThruster()
                autoThrustActive = false
            }, zero)
        }, right)
    }

    const timedRightThruster = (left, zero) => {
        autoThrustActive = true
        lander.activateRightThruster()
        request = setTimeout(() => {
            lander.deactivateRightThruster()
            lander.activateLeftThruster()
            request = setTimeout(() => {
                lander.deactivateLeftThruster()
                autoThrustActive = false
            }, zero)
        }, left)
    }

    // this.thrust2 = () => {
    //     if (lander.rotate[1] > 0) {
    //         if (lander.rotate[0] >= 0) {
    //             this.deactivateRightThruster()
    //             this.activateLeftThruster()
    //         } else {
    //             this.deactivateLeftThruster()
    //             const D = Math.pow(lander.rotate[0], 2) - (4 * .5 * lander.rotate[1])
    //             if (D > 0) {
    //                 this.activateRightThruster()
    //             }
    //         }
    //     }
    // }
}
