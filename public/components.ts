 
const inputBox : HTMLInputElement = document.getElementById('textInput') as HTMLInputElement
const button : HTMLButtonElement = document.getElementById('submit') as HTMLButtonElement
const output : HTMLDivElement = document.getElementById('output') as HTMLDivElement 

type ImageType = typeof Image 
class Stage {
    
    constructor(private image : string, private quote : string) {
    
    }

    render() {
        const canvas = document.createElement('canvas')
        canvas.width = 500 
        canvas.height = 300 
        const context = canvas.getContext('2d')
        output.appendChild(canvas)
        const img = new Image(256, 256)
        img.src = this.image 
        img.onload = () => {
            if (context) {
                context.fillStyle = '#212121'
                context.fillRect(0, 0, canvas.width, canvas.height)
                const x = canvas.width / 2 - img.width / 2
                const y = canvas.height / 2 - img.height / 2
                context.drawImage(img, x, y)
                context.font = context.font.replace(/\d+/, `16`)
                console.log(context.font)
                context.fillStyle = '#BDBDBD'
                context.fillText(this.quote, canvas.width / 2 - context.measureText(this.quote).width / 2, y +img.height + 20)
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