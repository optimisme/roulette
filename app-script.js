const devicePixelRatio = window.devicePixelRatio || 1;
var grup = ''
var cnv = null
var ctx = null
var timeLast = 0
var timeNow = 0
var twoPI = Math.PI * 2
var fps = 0
var fpsDraw = false
var angle = 0
var anim = new Animation()
var espais = 0
var selGrup = null
var selAssignatura = null
var ultimAlumne = ''
var ultimDate = Date.now()
var played = false
var refText = ""

var list = []

function init() {
  cnv = document.getElementById('cnv')
  ctx = cnv.getContext('2d')

  refText = document.querySelector('#text')
  refText.addEventListener('keyup', () => { updateList() })
  refText.addEventListener('change', () => { updateList() })

  list = ["Dog 🐶", "Cat 🐱", "Bear 🐻", "Unicorn 🦄", "Lion 🦁", "Cow 🐮", "Pig 🐷", "Hamster 🐹", "Penguin 🐧"]
  refText.innerHTML = list.join("\n")

  cnv.width = 500
  cnv.height = 500

  grup = list
  espais = list.length

  resize()
  window.addEventListener('resize', resize)

  window.requestAnimationFrame(draw)
}

function updateList() {
  list = refText.value.split("\n")
  espais = list.length
}

function draw () {

  drawBackground()

  setFPS()
  if (fpsDraw) {
    ctx.fillStyle = '#aaa'
    ctx.font = '20px "Open Sans, Arial"'
    ctx.fillText(parseInt(fps, 10), 15, 30)
  }

  anim.run()
  angle = anim.value

  drawGrup()

  window.requestAnimationFrame(draw)
}

function drawBackground () {

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, cnv.width, cnv.height)
}

function setFPS () {

  var now = Date.now()

  if(!timeLast) {
      timeNow = now
      timeLast = timeNow
      fps = 0
      return
  }
  
  timeLast = timeNow
  timeNow = now
  delta = (now - timeLast) / 1000
  fps = 1 / delta
} 

function drawGrup () {

  cnt = 0
  nom = ''
  migX = cnv.width / 2
  migY = cnv.height / 2
  if (migX < migY) {
    radi = migX - migX * 0.1
  } else {
    radi = migY - migY * 0.1
  }
  angleAdd = angle
  angleEspais = twoPI / espais
  angleEspaisHalf = angleEspais / 2
  angleB = -angleEspaisHalf
  angleM = 0
  angleE = +angleEspaisHalf
  alumne = Math.round(((-angle % twoPI)) * espais / twoPI)
  if (alumne === espais) { alumne = 0 }

  ctx.fillStyle = '#555'
  ctx.font = (16 * devicePixelRatio) + 'px "Open Sans"'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = '#fff6b3'
  ctx.beginPath()
  ctx.moveTo(migX, migY)
  ctx.lineTo(migX + radi * Math.cos(angleB), migY + radi * Math.sin(angleB))
  ctx.arc(migX, migY, radi, angleE, angleB, twoPI)
  ctx.lineTo(migX + radi * Math.cos(angleE), migY + radi * Math.sin(angleE))
  ctx.fill()

  ctx.fillStyle = '#555'
  ctx.lineWidth = 0.5 *  devicePixelRatio
  for (cnt = 0; cnt < espais; cnt = cnt + 1) {
    nom = list[cnt]
    angleM = angleAdd
    angleB = -angleEspaisHalf
    angleE = +angleEspaisHalf

    ctx.save()
    ctx.translate(migX, migY)
    ctx.rotate(angleM)

    ctx.fillText(nom, radi - ctx.measureText(nom).width - 6, 0)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(radi * Math.cos(angleB), radi * Math.sin(angleB))
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, radi, angleE, angleB, twoPI)
    ctx.stroke()
    ctx.restore()

    angleAdd = angleAdd + angleEspais
  }

  ctx.fillStyle = '#222'
  ctx.beginPath()
  ctx.moveTo(migX + radi + 4, migY)
  ctx.lineTo(migX + radi + 16, migY - 8)
  ctx.lineTo(migX + radi + 16, migY + 8)
  ctx.closePath()
  ctx.fill()

}

function resize () {
  
  let ref = document.querySelector('.controls')
  cnv.height = document.body.clientHeight * devicePixelRatio
  cnv.width = (document.body.clientWidth - ref.offsetWidth) * devicePixelRatio
}

async function play () {

  var temps = Math.floor(Math.random() * 7500) + 5000
  var voltes = Math.floor(Math.random() * 5) + 2
  var alumne = Math.floor(Math.random() * espais)

  angleAlumne = (alumne > 0) ? (twoPI * alumne / espais) : 0
  anim.setAnimation('ease-out', angle - (twoPI * voltes), -angleAlumne, temps)
  ultimDate = Date.now()

  played = true
}

async function setStats (stat) {
  var idxAssg = selAssignatura.selectedIndex
  var valAssg = selAssignatura.options[idxAssg].value
  var idxGrup = selGrup.selectedIndex
  var valGrup = selGrup.options[idxGrup].value
  var storageName = valAssg + '-' + valGrup
  var storageTxt = null

  try { storageTxt = await storageGetItem(storageName) } catch (e) { console.warn(e) }

  played = false
}

function fillSpaces (str, val) {
  return (new Array(val - str.length + 1)).join('&nbsp;')
}
