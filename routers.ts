import { Socket } from "socket.io"

interface Router {
    path : string, 
    handler : (a : any) => void 
}

const queryRouter : Router = {
    path : 'input',
    handler(data) {
        const {query, queryId} = JSON.parse(data)
        console.log(`FromRouter: Query received with queryId ${query} ${queryId}`)
        console.log('FromRouter: Data', data)
    }
}

const routers : Array<Router> = []
routers.push(queryRouter)


const initializeRouters = (socket : Socket) => {
    routers.forEach((router : Router) => {
        socket.on(router.path, router.handler)
    })
}

export default initializeRouters