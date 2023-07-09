 
const inputBox : HTMLInputElement = document.getElementById('textInput') as HTMLInputElement
const button : HTMLButtonElement = document.getElementById('submit') as HTMLButtonElement
const output : HTMLDivElement = document.getElementById('output') as HTMLDivElement 

type ImageType = typeof Image 

type IntervalType = ReturnType<typeof setInterval>

const DELAY : number = 10 

type AnimationFn = () => void

interface AnimationNode {
    id : number, 
    cb : AnimationFn
}

class Loop {

    animated : boolean = false 
    interval? : IntervalType

    cbs : Array<AnimationNode> = []
    count : number = 0

    push(cb : AnimationFn) : number  {
        this.count++
        this.cbs.push({
            id: this.count, 
            cb
        })
        return this.count
    }

    start() {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(() => {
                this.cbs.forEach((an : AnimationNode) => {
                    an.cb()
                })
            }, DELAY)
        }
    }

    stop(id : number) {
        this.cbs = this.cbs.filter((an : AnimationNode) => an.id != id)
        if (this.cbs.length == 0) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }

}


class Loader {
    
    start : number = 0 
    end : number = 0
    startDir : number = 0 
    endDir : number = 1 

    shown : boolean = true
    
    draw(context : CanvasRenderingContext2D, cx : number, cy : number) {
        if (!this.shown) {
            return 
        }
        
        context.strokeStyle = "indigo"
        context.lineCap = 'round'
        context.lineWidth = Math.min(window.innerWidth, window.innerHeight) / 80
        const r : number = Math.min(window.innerHeight, window.innerWidth) / 11
        context.save()
        context.translate(cx, cy)
        context.beginPath()
        for (let j = this.start; j <= this.end; j++) {
            const x : number = r * Math.cos(j * Math.PI / 180)
            const y : number = r * Math.sin(j * Math.PI / 180)
            if (j == this.start) {
                context.moveTo(x ,y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
        context.restore()
    }

    update() {
        this.start += 15 * this.startDir
        this.end += 15 * this.endDir 
        if (this.end == 360 && this.start == 360) {
            this.startDir = 0
            this.endDir = 1
            this.start = 0 
            this.end = 0 
        } else if (this.end == 360) {
            this.endDir = 0 
            this.startDir = 1
        }
    }

    render(context : CanvasRenderingContext2D, cx : number, cy : number) {
        this.draw(context, cx, cy)
        this.update()
    }

    remove() {
        this.shown = false 
    }
}

const loop : Loop = new Loop()

class Stage {
    
    context : CanvasRenderingContext2D | null = null 
    canvas : HTMLCanvasElement = document.createElement('canvas')
    loader : Loader = new Loader()
    loaderId : number = -1
    constructor() {
    
    }

    initCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 500 
        this.canvas.height = 300 
        this.context = this.canvas.getContext('2d')
        output.appendChild(this.canvas)
        this.loaderId = loop.push(() => {
            if (this.context) {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.loader.render(this.context, this.canvas.width / 2, this.canvas.height / 2)
            }
        })
        loop.start()
    }

    render(image : string, quote : string) {
        
        const w : number = this.canvas.width 
        const h : number = this.canvas.height 

        const img = new Image(256, 256)
        img.src = image 
        img.onload = () => {
            loop.stop(this.loaderId)
            if (this.context) {
                const context : CanvasRenderingContext2D = this.context 
                context.fillStyle = '#212121'
                context.fillRect(0, 0, w, h)
                const x = w / 2 - img.width / 2
                const y = h / 2 - img.height / 2
                context.drawImage(img, x, y)
                context.font = context.font.replace(/\d+/, `16`)
                console.log(context.font)
                context.fillStyle = '#BDBDBD'
                context.fillText(quote, w / 2 - context.measureText(quote).width / 2, y +img.height + 20)
            }
            
        }
    }



    static create() : Stage {
        const stage : Stage = new Stage()
        stage.initCanvas()
        return stage 
    }
}

class QueryContainer {

    queries : String[] = []
    count : number = 0
    addQuery(query : string) {
        this.queries.push(query)
        this.count++
    }

    getCurrQueryId() : string {
        return `query_${this.count}`
    }
}

const queryContainer = new QueryContainer()

const stageMap : Record<string, Stage> = {}

const handleButtonClick = (cb : (a : string, b : string) => void) => {
    button.onclick = () => {
        const query = inputBox.value 
        queryContainer.addQuery(query)
        stageMap[queryContainer.getCurrQueryId()] = Stage.create()
        cb(query, queryContainer.getCurrQueryId())
    }
}

const renderImageWithText = (queryId : string, quote : string, image : string) => {
    stageMap[queryId].render(image, quote)
}