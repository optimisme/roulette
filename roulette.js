function showManagement (show) {
    managementRedoList()
    if (show) {
        document.getElementById('management').classList.add('managementShow');
    } else {
        document.getElementById('management').classList.remove('managementShow');
    }
}

function managementAddToList () {
    let cnt = 0,
        ref = document.getElementById('text'),
        arr = ref.value.split('\n')

    for (cnt = 0; cnt < arr.length; cnt = cnt + 1) {
        roulette.addToList(arr[cnt])
    }
    managementRedoList()
    ref.value = ''
}

function managementRedoList () {
    let cnt = 0,
        ref = document.getElementById('managementList'),
        str = '';

    for (cnt = 0; cnt < roulette.list.length; cnt = cnt + 1) {
        str = str + '<div class="flexRow listItem">'
        str = str + '    <div class="flexExp">' + roulette.list[cnt].text + '</div>'
        str = str + '    <div class="button" onclick="managementRemoveItem(' + roulette.list[cnt].id + ')">'
        str = str + '        <span class="material-icons button" onclick="showManagement(true)">delete</span>'
        str = str + '    </div>'
        str = str + '</div>'
    }

    ref.innerHTML = str
}

function managementRemoveItem (id) {
    roulette.removeItem(id)
    managementRedoList()
}

class ObjRoulette {

    constructor () {
        this.handlerInit = this.init.bind(this)
        this.handlerSize = this.resize.bind(this)
        this.handlerDraw = this.draw.bind(this)
        window.addEventListener('load', this.handlerInit)
        window.addEventListener('resize', this.handlerSize)
    }

    init () {
        window.removeEventListener('load', this.handler)

        this.playType = 'eliminate' // 'all', 'weigth', 'eliminate'
        this.showWeigths = true

        this.list = [
            { id: 0, text: 'Cara',   wins: 0,  weight: 0 }, 
            { id: 1, text: 'Creu',   wins: 0,  weight: 0 },
        ]
        this.twoPI = Math.PI * 2
        this.angle = 0
        this.last = ''
        this.anim = new Animation()
        this.playTimeout = undefined
        this.lastWin = -1

        this.cnv = document.getElementById('cnv')
        this.ctx = this.cnv.getContext('2d')

        this.timeLast = 0
        this.timeNow = 0
        this.fps = 0
        this.fpsDraw = false

        this.resize()
        this.draw()
    }

    resize () {
        var ref = document.getElementById('roulette'),
            style = window.getComputedStyle(ref, '')

        this.cnv.width = parseInt(style.getPropertyValue('width'))
        this.cnv.height = parseInt(style.getPropertyValue('height'))
    }

    draw () {
        let ctx = this.ctx

        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, cnv.width, cnv.height)
      
        this.setFPS()
        if (this.fpsDraw) {
          ctx.fillStyle = '#aaa'
          ctx.font = '20px "Open Sans, Arial"'
          ctx.fillText(parseInt(this.fps, 10), 15, 30)
        }
      
        this.anim.run()
        this.angle = this.anim.value

        this.drawList();

        window.requestAnimationFrame(this.handlerDraw)
    }

    setFPS () {
        let now = Date.now(),
            delta = 0.1;
      
        if(!this.timeLast) {
            this.timeNow = now
            this.timeLast = this.timeNow
            this.fps = 0
            return
        }
        
        this.timeLast = this.timeNow
        this.timeNow = now
        delta = (now - this.timeLast) / 1000
        this.fps = 1 / delta
    } 

    drawList () {

        let ctx = this.ctx,
            cnt = 0,
            nom = '',
            migX = this.cnv.width / 2,
            migY = this.cnv.height / 2,
            radi = 0.0,
            angleAdd = this.angle,
            anglespaces = this.twoPI / this.list.length,
            anglespacesHalf = anglespaces / 2,
            angleB = -anglespacesHalf,
            angleM = 0,
            angleE = +anglespacesHalf,
            item = Math.round(((-this.angle % this.twoPI)) * this.list.length / this.twoPI)

        if (migX < migY) {
          radi = migX - migX * 0.1
        } else {
          radi = migY - migY * 0.1
        }

        if (item === this.list.length) { item = 0 }
      
        ctx.fillStyle = '#555'
        ctx.font = '16px "Open Sans"'
        ctx.textBaseline = 'middle'
      
        ctx.fillStyle = '#fff6b3'
        ctx.beginPath()
        ctx.moveTo(migX, migY)
        ctx.lineTo(migX + radi * Math.cos(angleB), migY + radi * Math.sin(angleB))
        ctx.arc(migX, migY, radi, angleE, angleB, this.twoPI)
        ctx.lineTo(migX + radi * Math.cos(angleE), migY + radi * Math.sin(angleE))
        ctx.fill()
      
        ctx.fillStyle = '#555'
        ctx.lineWidth = 0.5
        for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
            nom = this.list[cnt].text

            angleM = angleAdd
            angleB = -anglespacesHalf
            angleE = +anglespacesHalf
        
            ctx.save()
            ctx.translate(migX, migY)
            ctx.rotate(angleM)
            
            if (cnt === item) {
            this.last = nom
            }
        
            ctx.fillText(nom, radi - ctx.measureText(nom).width - 6, 0)

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(radi * Math.cos(angleB), radi * Math.sin(angleB))
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(0, 0, radi, angleE, angleB, this.twoPI)
            ctx.stroke()

            ctx.fillStyle = 'rgba(100, 100, 100, ' + (0.2 * this.list[cnt].weight) + ')'
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(radi * Math.cos(angleB), radi * Math.sin(angleB))
            ctx.arc(0, 0, radi, angleE, angleB, this.twoPI)
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(radi * Math.cos(angleB), radi * Math.sin(angleB))
            ctx.lineTo(radi * Math.cos(angleE), radi * Math.sin(angleE))
            ctx.fill()

            ctx.restore()
        
            angleAdd = angleAdd + anglespaces
        }
      
        ctx.fillStyle = '#222'
        ctx.beginPath()
        ctx.moveTo(migX + radi + 4, migY)
        ctx.lineTo(migX + radi + 16, migY - 8)
        ctx.lineTo(migX + radi + 16, migY + 8)
        ctx.closePath()
        ctx.fill()
    }

    play () {
        let time = Math.floor(Math.random() * 5000) + 2500,
            turns = Math.floor(Math.random() * 5) + 2,
            angleWinner = 0,
            winner = 0

        switch (this.playType) {
        case 'all':
            winner = this.getWinnerAll()
            break
        case 'weigth':
            winner = this.getWinnerWeight()
            break
        case 'eliminate':
            winner = this.getWinnerEliminate()
            break
        }
        this.lastWin = winner

        angleWinner = (winner > 0) ? (this.twoPI * winner / this.list.length) : 0
        this.anim.setAnimation('ease-out', this.angle - (this.twoPI * turns), -angleWinner, time)
        if (this.playTimeout !== undefined) clearTimeout(this.playTimeout)
        this.playTimeout = setTimeout(() => {
            this.playTimeout = undefined
            if (this.lastWin >= 0 && this.lastWin < this.list.length) {
                this.list[this.lastWin].wins = this.list[this.lastWin].wins + 1
            }
            this.setWeights()
        }, time - 500)
    }

    getWinnerAll () {
        return Math.floor(Math.random() * this.list.length)
    }

    getWinnerWeight () {
        let cntA = 0,
            cntB = 0,
            tmpArr = [],
            winner = 0,
            top = 0,
            times = 0

        for (cntA = 0; cntA < this.list.length; cntA = cntA + 1) {
            if (this.list[cntA].wins > top) top = this.list[cntA].wins > top
        }

        for (cntA = 0; cntA < this.list.length; cntA = cntA + 1) {
            times = this.list[cntA].wins - top
            for (cntB = 0; cntB < times; cntB = cntB + 1) {
                tmpArr.push(this.list[cntA])
            }
        }

        if (tmpArr.length === 0) tmpArr = this.list

        winner = Math.floor(Math.random() * tmpArr.length)

        for (cntA = 0; cntA < this.list.length; cntA = cntA + 1) {
            if (this.list[cntA].id === tmpArr[winner].id) {
                return cntA
            }
        }

        return 0
    }

    getWinnerEliminate () {
        let cnt = 0,
            tmpArr = this.list.filter((item) => { return (item.wins === 0) }),
            winner = Math.floor(Math.random() * tmpArr.length)

        if (tmpArr.length === 0) return 0

        for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
            if (this.list[cnt].id === tmpArr[winner].id) {
                return cnt
            }
        }

        return 0
    }

    setWeights () {
        let cnt = 0,
            top = 0

        if (!this.showWeigths) {
            for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
                this.list[cnt].weight = 0
            }
        } else {
            if (this.playType === 'all') {
                for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
                    this.list[cnt].weight = 0
                }
            } else if (this.playType === 'eliminate') {
                for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
                    if (this.list[cnt].wins === 0) this.list[cnt].weight = 0
                    else this.list[cnt].weight = 1
                }
            } else {
                for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
                    if (this.list[cnt].wins > top) top = this.list[cnt].wins > top
                }
                for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
                    this.list[cnt].weight = this.list[cnt].wins / top
                }
            }
        }
    }

    addToList (name) {
        this.list.push({ id: 0, text: name,   wins: 0,  weight: 0 })
        this.redoIds()
    }

    removeItem (id) {
        this.list.splice(id, 1)
        this.redoIds()
    }

    redoIds () {
        let cnt = 0
        for (cnt = 0; cnt < this.list.length; cnt = cnt + 1) {
            this.list[cnt].id = cnt
        }
    }
}

var roulette = new ObjRoulette()
