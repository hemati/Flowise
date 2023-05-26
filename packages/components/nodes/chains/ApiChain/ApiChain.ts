import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { APIChain } from 'langchain/chains'
import { CustomChainHandler, getBaseClasses } from '../../../src/utils'
import { BaseLanguageModel } from 'langchain/base_language'
import { Document } from 'langchain/document'
import { PromptTemplate } from 'langchain/prompts'
import { OpenAI } from 'langchain'

class ApiChain_Chains implements INode {
    label: string
    name: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'API Chain'
        this.name = 'apiChain'
        this.type = 'ApiChain'
        this.icon = 'apichain.svg'
        this.category = 'Chains'
        this.description = 'Chain to run queries against API'
        this.baseClasses = [this.type, ...getBaseClasses(APIChain), ...getBaseClasses(OpenAI)]
        this.inputs = [
            {
                label: 'Language Model',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: 'Document',
                name: 'document',
                type: 'Document',
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const docs = nodeData.inputs?.document as Document[]

        const chain = await getOpenAPIChain(docs, model)
        return chain
    }

    async run(nodeData: INodeData, input: string,  options: ICommonObject): Promise<string> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const docs = nodeData.inputs?.document as Document[]

        const chain = await getOpenAPIChain(docs, model)
        if (options.socketIO && options.socketIOClientId) {
            const handler = new CustomChainHandler(options.socketIO, options.socketIOClientId)
            const res = await chain.run(input, [handler])
            return res
        } else {
            const res = await chain.run(input)
            return res
        }
    }
}

const getOpenAPIChain = async (documents: Document[], llm: BaseLanguageModel, options: any = {}) => {
    const texts = documents.map(({ pageContent }) => pageContent);
    const apiResponsePrompt = new PromptTemplate({
        inputVariables: ["api_docs", "question", "api_url", "api_response"],
        template: "Given this {api_response} response for {api_url}. use the given response to answer this {question}",
    });

    const chain = APIChain.fromLLMAndAPIDocs(llm, texts.toString(), { 
        apiResponsePrompt, 
        verbose: process.env.DEBUG === 'true' ? true : false,
    })
    return chain
}

module.exports = { nodeClass: ApiChain_Chains }
