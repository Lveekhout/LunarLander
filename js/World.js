function World(lander) {

    let scale = 20
    let current
    let frameReq

    const gravity = 9.81 / 2 / 6
    const animationCallbacks = []

    const animate = milli => {
        const dtm = milli - current // DeltaTimeMilliseconds
        const dts = dtm / 1000      // DeltaTimeSeconds
        current = milli

        lander.draw(scale)
        frameReq = window.requestAnimationFrame(animate)
        animationCallbacks.forEach(f => f())
        lander.update(dts)
    }

    const initAnimate = milli => {
        start = current = milli
        frameReq = window.requestAnimationFrame(animate)
    }

    this.startAnimation = () => {
        frameReq = window.requestAnimationFrame(initAnimate)
    }

    this.stopAnimation = () => {
        window.cancelAnimationFrame(frameReq)
    }

    this.addAnimationCallbackCallback = f => animationCallbacks.push(f)
    this.setScale = value => scale = value

    lander.setGravity(gravity)

    lander.belowSurface = () => this.stopAnimation()
}
