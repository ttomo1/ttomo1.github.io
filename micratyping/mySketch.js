let speaker
let data=[]
let name=''
let img=''
let snd=''

function preload(){
	data=loadJSON('data.json')
	speaker = new p5.Speech();
	speaker.onLoad = voicesLoaded;
}

function setup() {
	createCanvas(windowWidth,windowHeight)
	soundFormats('ogg')
	make_question()
}

let state='answer'
let did=0
let c=''
let cid=0
let temp=''
function make_question(){
	if(img!='')img.hide()
	state='answer'
	did=int(random(Object.keys(data).length))
	name=data[did].name.toUpperCase()
	img=createImg(data[did].img_url,'')
	img.position(width,height)
	snd=(data[did].snd_url!='')?loadSound(data[did].snd_url):''
	c=''
	cid=0
	temp=''
}

function show_answer(){
	state='wait'
	const s=img.size()
	const h=200
	const r=s.height/200
	const w=int(s.width/r)
	img.size(w,h)
	img.position(int((width-w)/2),100)
	if(snd!='')snd.play()
	speaker.speak(name)
}

function voicesLoaded(){	
	speaker.setVoice('Google US English')
	speaker.setLang('en')
	speaker.setPitch(1)
	speaker.setRate(1)
	speaker.setVolume(1)
	speaker.interrupt = true
//	speaker.speak('I\'m ready!')
}

function draw(){
	background(0)
	textSize(30)
	textAlign(LEFT,TOP)
	fill(128)
	text(name,(width-textWidth(name))/2,50)
	fill(255)
	text(temp,(width-textWidth(name))/2,50)
	if(state=='wait'){
		textSize(30)
		textAlign(CENTER,CENTER)
		fill(255)
		text('Press Enter!',width/2,350)				
	}
	else{
		textSize(100)
		textAlign(CENTER,CENTER)
		fill(correct ? [255,255,255] : [255,0,0])
		text(c,width/2,150)
	}
}

let correct=false
function keyPressed()
{
	if(state=='wait'){
		if(keyCode==ENTER){
			make_question()
		}
	}
	else{
		correct=false
		c=key
		speaker.speak(key)
		if(key==name[cid]){
			correct=true
			temp+=key
			cid++
			if(name[cid]==' '){
				temp+=' '
				cid++
			}
			if(cid==name.length){
				show_answer()
			}
		}
	}
	
	
	
}
