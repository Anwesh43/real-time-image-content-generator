 
const inputBox : HTMLInputElement = document.getElementById('textInput') as HTMLInputElement
const button : HTMLButtonElement = document.getElementById('submit') as HTMLButtonElement
const output : HTMLDivElement = document.getElementById('output') as HTMLDivElement 

type ImageType = typeof Image 
class Stage {
    
    constructor(private image : string, private quote : string) {
    
    }

    render() {
        const canvas = document.createElement('canvas')
        canvas.width = 256 
        canvas.height = 300 
        const context = canvas.getContext('2d')
        document.body.appendChild(canvas)
        const img = new Image(256, 256)
        img.src = this.image 
        img.onload = () => {
            if (context) {
                context.drawImage(img, 0, 0)
                context.font = context.font.replace(/\d/g, `32`)
                context.fillStyle = 'black'
                context.fillText(this.quote, 128 - context.measureText(this.quote).width / 2, 288)
            }
            
        }
    }



    static create(image : string, quote : string) : Stage {
        const stage : Stage = new Stage(image, quote)
        stage.render()
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

const handleButtonClick = (cb : (a : String, b : String) => void) => {
    button.onclick = () => {
        const query = inputBox.value 
        queryContainer.addQuery(query)
        cb(query, queryContainer.getCurrQueryId())
    }
}