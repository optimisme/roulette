var devicePixelRatio = window.devicePixelRatio || 1
var list = []
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
var refText = ""

function init() {
  cnv = document.getElementById('cnv')
  ctx = cnv.getContext('2d')

  refText = document.querySelector('#text')
  refText.addEventListener('keyup', () => { updateList() })
  refText.addEventListener('change', () => { updateList() })

  list = ["Dog 🐶", "Cat 🐱", "Bear 🐻", "Unicorn 🦄", "Lion 🦁", "Cow 🐮", "Pig 🐷", "Hamster 🐹", "Penguin 🐧"]
  espais = list.length

  refText.innerHTML = list.join("\n")

  resize()
  window.addEventListener('resize', resize)

  window.requestAnimationFrame(draw)
}

function updateList() {
  list = refText.value.split("\n")
  espais = list.length
}

function draw () {

  // Draw background
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, cnv.width, cnv.height)

  setFPS()
  if (fpsDraw) {
    ctx.fillStyle = '#aaa'
    ctx.font = '20px "Open Sans, Arial"'
    ctx.fillText(parseInt(fps, 10), 15, 30)
  }

  anim.run()
  angle = anim.value

  drawList()

  window.requestAnimationFrame(draw)
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

function drawList () {

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
  selectedItem = Math.round(((-angle % twoPI)) * espais / twoPI)
  if (selectedItem === espais) { selectedItem = 0 }

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
  ctx.lineWidth = 0.75 *  devicePixelRatio
  for (cnt = 0; cnt < espais; cnt = cnt + 1) {
    nom = list[cnt]
    angleM = angleAdd
    angleB = -angleEspaisHalf
    angleE = +angleEspaisHalf

    ctx.save()
    ctx.translate(migX, migY)
    ctx.rotate(angleM)

    ctx.fillText(nom, radi - ctx.measureText(nom).width - 6 * devicePixelRatio, 0)
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

  let triangle = 4 * devicePixelRatio
  ctx.fillStyle = '#222'
  ctx.beginPath()
  ctx.moveTo(migX + radi + triangle, migY)
  ctx.lineTo(migX + radi + triangle * 4, migY - triangle * 2)
  ctx.lineTo(migX + radi + triangle * 4, migY + triangle * 2)
  ctx.closePath()
  ctx.fill()
}

function resize () {
  let ref = document.querySelector('.controls')

  devicePixelRatio = window.devicePixelRatio || 1 // Change to another screen

  cnv.height = document.body.clientHeight * devicePixelRatio
  cnv.width = (document.body.clientWidth - ref.offsetWidth) * devicePixelRatio
}

async function play () {

  var temps = Math.floor(Math.random() * 7500) + 5000
  var voltes = Math.floor(Math.random() * 5) + 2
  var selectedItem = Math.floor(Math.random() * espais)

  angleSelected = (selectedItem > 0) ? (twoPI * selectedItem / espais) : 0
  anim.setAnimation('ease-out', angle - (twoPI * voltes), -angleSelected, temps)
}