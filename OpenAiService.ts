
import axios, { AxiosResponse } from "axios";
import { Configuration, CreateCompletionRequest, CreateImageRequest, OpenAIApi } from "openai";

export default class OpenAiService {
    api : OpenAIApi

    constructor(apiKey : string, organization : string) {
        const configuration = new Configuration({
            apiKey,
            organization
        })
        console.log("APIKEY", apiKey)
        this.api = new OpenAIApi(configuration)
    }

    async generateImage(prompt : string) : Promise<string> {
        const imageRequest : CreateImageRequest = {
            prompt, 
            size: "256x256",
            n : 1
        }
        const response = await this.api.createImage(imageRequest)
        const url = response.data.data[0].url 
        console.log(`Downloading response url ${url}`)
        // const downloadFileResponse = await axios.get(url || '', {
        //     responseType: "arraybuffer"
        // })
        // const base64Str = Buffer.from(downloadFileResponse.data, 'binary').toString('base64')
        // console.log("Downloaded Image", base64Str)
        return url || ''
    }

    async generateText(prompt : string) : Promise<string> {
        const textRequest : CreateCompletionRequest = {
            prompt: `${prompt}, limit the response to 10 words`, 
            temperature: 0.1,
            model: "text-davinci-002"
        }
        const response  = await this.api.createCompletion(textRequest)
        
        return response.data?.choices[0]?.text || ""
    }
}

