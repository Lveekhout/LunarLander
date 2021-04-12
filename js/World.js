function World(lander) {
    let duur
    let start
    let current
    let frameReq

    const gravity = 9.81 / 2 / 6

    const animate = milli => {
        const dtm = milli - current // DeltaTimeMilliseconds
        const dts = dtm / 1000      // DeltaTimeSeconds
        current = milli

        lander.draw()
        frameReq = window.requestAnimationFrame(animate)
        lander.update(dts)
    }

    const initAnimate = milli => {
        start = current = milli
        frameReq = window.requestAnimationFrame(animate)
    }

    this.startAnimation = () => {
        duur = performance.now()
        frameReq = window.requestAnimationFrame(initAnimate)
    }

    this.stopAnimation = () => {
        console.log('duur = ' + (performance.now() - duur))
        console.log('start = ' + (current - start))
        window.cancelAnimationFrame(frameReq)
        // document.getElementById("textarea").value = null
    }

    lander.setGravity(gravity)

    lander.belowSurface = () => this.stopAnimation()
}
