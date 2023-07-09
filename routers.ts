import { config } from "dotenv"
import { Socket } from "socket.io"
import OpenAiService from "./OpenAiService"

interface Router {
    path : string, 
    handler : (a : any, s : Socket) => void 
}
config()
const openAiService = new OpenAiService(process.env.OPEN_API_KEY || '', process.env.OPEN_AI_ORGID || '')

const queryRouter : Router = {
    path : 'input',
    async handler(data : any, socket : Socket) {
        const {query, queryId} = JSON.parse(data)
        console.log(`FromRouter: Query received with queryId ${query} ${queryId}`)
        console.log('FromRouter: Data', data)
        const quote = await openAiService.generateText(query)
        const imgData = await openAiService.generateImage(quote)  
        socket.emit("create-image-stage", JSON.stringify({quote, imgData, queryId}))
    }
}

const routers : Array<Router> = []
routers.push(queryRouter)


const initializeRouters = (socket : Socket) => {
    routers.forEach((router : Router) => {
        socket.on(router.path, (data) => {
            router.handler(data, socket)
        })
    })
}

export default initializeRouters