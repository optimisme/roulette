class Animation {

    // ease function from 'tween.js' -> http://easings.net/, http://sole.github.io/tween.js/examples/03_graphs.html

     constructor () {

        this.func = 'linear'

        this.timeDuration = 0.0
        this.timeBegin = 0.0
        this.timeEnd = 0.0

        this.value = 0.0
        this.valueBegin = 0.0
        this.valueEnd = 0.0
        this.valueDif = 0.0
     }

     setAnimation (func, begin, end, time) {

        this.func = func

        this.timeDuration = time
        this.timeBegin = performance.now()
        this.timeEnd = this.timeBegin + time

        this.value = begin
        this.valueBegin = begin
        this.valueEnd = end
        this.valueDif = end - begin
     }

     isRunning () {      
        let roundEnd = Math.round(this.timeEnd * 1000) / 1000
        let roundNow = Math.round(performance.now() * 1000) / 1000
        return roundEnd >= roundNow
     }

     isEnded () {
        return !this.isRunning()
     }

     run () {

        let now = performance.now(),
            p = 0.0,
            q = 0.0

        if (now >= this.timeEnd) {
            this.value = this.valueEnd
        } else {
            p = (now - this.timeBegin) / this.timeDuration
            switch (this.func) {
            case 'ease':            q = this.inOutSine(p); break
            case 'ease-in':         q = this.inCube(p); break
            case 'ease-out':        q = this.outCube(p); break
            case 'ease-in-out':     q = this.inOutCube(p); break
            case 'inQuad':          q = this.inQuad(p); break
            case 'outQuad':         q = this.outQuad(p); break
            case 'inOutQuad':       q = this.inOutQuad(p); break
            case 'outCube':         q = this.outCube(p); break
            case 'inOutCube':       q = this.inOutCube(p); break
            case 'inQuart':         q = this.inQuart(p); break
            case 'outQuart':        q = this.outQuart(p); break
            case 'inOutQuart':      q = this.inOutQuart(p); break
            case 'inQuint':         q = this.inQuint(p); break
            case 'outQuint':        q = this.outQuint(p); break
            case 'inOutQuint':      q = this.inOutQuint(p); break
            case 'inSine':          q = this.inSine(p); break
            case 'outSine':         q = this.outSine(p); break
            case 'inOutSine':       q = this.inOutSine(p); break
            case 'inExpo':          q = this.inExpo(p); break
            case 'outExpo':         q = this.outExpo(p); break
            case 'inOutExpo':       q = this.inOutExpo(p); break
            case 'inCirc':          q = this.inCirc(p); break
            case 'outCirc':         q = this.outCirc(p); break
            case 'inOutCirc':       q = this.inOutCirc(p); break
            case 'inBack':          q = this.inBack(p); break
            case 'outBack':         q = this.outBack(p); break
            case 'inBounce':        q = this.inBounce(p); break
            case 'outBounce':       q = this.outBounce(p); break
            case 'inOutBounce':     q = this.inOutBounce(p); break
            case 'inElastic':       q = this.inElastic(p); break
            case 'outElastic':      q = this.outElastic(p); break
            case 'inOutElastic':    q = this.inOutElastic(p); break
            default:                q = this.linear(p); break
            }
            this.value = this.valueBegin + (q * this.valueDif)
        }
     }

    finishAnimation () {

        this.begin = 0.0
        this.duration = 0.0
        this.start = this.end
        this.end = 0.0
    }

    linear (n){
        return n
    }

    inQuad (n){
        return n * n
    }

    outQuad (n){
        return n * (2 - n)
    }

    inOutQuad (n){
        n *= 2
        if (n < 1) return 0.5 * n * n
        return - 0.5 * (--n * (n - 2) - 1)
    }

    inCube (n){
        return n * n * n
    }

    outCube (n){
        return --n * n * n + 1
    }

    inOutCube (n){
        n *= 2
        if (n < 1) return 0.5 * n * n * n
        return 0.5 * ((n -= 2 ) * n * n + 2)
    }

    inQuart (n){
        return n * n * n * n
    }

    outQuart (n){
        return 1 - (--n * n * n * n)
    }

    inOutQuart (n){
        n *= 2
        if (n < 1) return 0.5 * n * n * n * n
        return -0.5 * ((n -= 2) * n * n * n - 2)
    }

    inQuint (n){
        return n * n * n * n * n
    }

    outQuint (n){
        return --n * n * n * n * n + 1
    }

    inOutQuint (n){
        n *= 2
        if (n < 1) return 0.5 * n * n * n * n * n
        return 0.5 * ((n -= 2) * n * n * n * n + 2)
    }

    inSine (n){
        return 1 - Math.cos(n * Math.PI / 2 )
    }

    outSine (n){
        return Math.sin(n * Math.PI / 2)
    }

    inOutSine (n){
        return .5 * (1 - Math.cos(Math.PI * n))
    }

    inExpo (n){
        return 0 == n ? 0 : Math.pow(1024, n - 1)
    }

    outExpo (n){
        return 1 == n ? n : 1 - Math.pow(2, -10 * n)
    }

    inOutExpo (n){
        if (0 == n) return 0
        if (1 == n) return 1
        if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1)
        return .5 * (-Math.pow(2, -10 * (n - 1)) + 2)
    }

    inCirc (n){
        return 1 - Math.sqrt(1 - n * n)
    }

    outCirc (n){
        return Math.sqrt(1 - (--n * n))
    }

    inOutCirc (n){
        n *= 2
        if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1)
        return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1)
    }

    inBack (n){
        let s = 1.70158
        return n * n * (( s + 1 ) * n - s)
    }

    outBack (n){
        let s = 1.70158
        return --n * n * ((s + 1) * n + s) + 1
    }

    inOutBack (n){
        let s = 1.70158 * 1.525
        if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) )
        return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 )
    }

    inBounce (n){
        return 1 - this.outBounce(1 - n)
    }

    outBounce (n){
        if ( n < ( 1 / 2.75 ) ) {
            return 7.5625 * n * n
        } else if ( n < ( 2 / 2.75 ) ) {
            return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75
        } else if ( n < ( 2.5 / 2.75 ) ) {
            return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375
        } else {
            return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375
        }
    }

    inOutBounce (n){
        if (n < .5) return this.inBounce(n * 2) * .5
        return this.outBounce(n * 2 - 1) * .5 + .5
    }

    inElastic (n){
        let s, a = 0.1, p = 0.4
        if ( n === 0 ) return 0
        if ( n === 1 ) return 1
        if ( !a || a < 1 ) { a = 1; s = p / 4; }
        else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI )
        return - ( a * Math.pow( 2, 10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) )
    }

    outElastic (n){
        let s, a = 0.1, p = 0.4
        if ( n === 0 ) return 0
        if ( n === 1 ) return 1
        if ( !a || a < 1 ) { a = 1; s = p / 4 }
        else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
        return ( a * Math.pow( 2, - 10 * n) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) + 1 )
    }

    inOutElastic (n){
        let s, a = 0.1, p = 0.4
        if ( n === 0 ) return 0
        if ( n === 1 ) return 1
        if ( !a || a < 1 ) { a = 1; s = p / 4; }
        else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI )
        if ( ( n *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) )
        return a * Math.pow( 2, -10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1
    }
}