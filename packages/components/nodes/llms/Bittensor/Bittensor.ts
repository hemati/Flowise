import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses } from '../../../src/utils'
import {NIBittensorLLM, BittensorInput} from 'langchain/experimental/llms/bittensor';

class Bittensor_LLMs implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'NIBittensorLLM'
        this.name = 'NIBittensorLLM'
        this.version = 1.0
        this.type = 'Bittensor'
        this.icon = 'logo.png'
        this.category = 'LLMs'
        this.description = 'Wrapper around Bittensor subnet 1 large language models'
        this.baseClasses = [this.type, ...getBaseClasses(NIBittensorLLM)]
        this.inputs = [
            {
                label: 'System prompt',
                name: 'system_prompt',
                type: 'string',
                additionalParams: true,
                optional: true
            },
            {
                label: 'Top Responses',
                name: 'topResponses',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            }
        ]
        
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const system_prompt = nodeData.inputs?.system_prompt as string
        const topResponses = Number(nodeData.inputs?.topResponses as number);
        const obj: Partial<BittensorInput> = {
            systemPrompt: system_prompt,
            topResponses: topResponses,
        }

        const model = new NIBittensorLLM(obj)
        return model
    }
}

module.exports = { nodeClass: Bittensor_LLMs }
