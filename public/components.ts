 
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


class Stage {
    
    context : CanvasRenderingContext2D | null = null 
    canvas : HTMLCanvasElement = document.createElement('canvas')
    constructor(private image : string, private quote : string) {
    
    }

    initCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 500 
        this.canvas.height = 300 
        this.context = this.canvas.getContext('2d')
        output.appendChild(this.canvas)
    }

    render() {
        
        const w : number = this.canvas.width 
        const h : number = this.canvas.height 

        const img = new Image(256, 256)
        img.src = this.image 
        img.onload = () => {
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
                context.fillText(this.quote, w / 2 - context.measureText(this.quote).width / 2, y +img.height + 20)
            }
            
        }
    }



    static create(image : string, quote : string) : Stage {
        const stage : Stage = new Stage(image, quote)
        stage.render()
        console.log('imageStr', image)
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

const handleButtonClick = (cb : (a : string, b : string) => void) => {
    button.onclick = () => {
        const query = inputBox.value 
        queryContainer.addQuery(query)
        cb(query, queryContainer.getCurrQueryId())
    }
}