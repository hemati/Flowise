import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { SqlDatabaseChain, SqlDatabaseChainInput } from 'langchain/chains/sql_db'
import { getBaseClasses } from '../../../src/utils'
import { DataSource } from 'typeorm'
import { SqlDatabase } from 'langchain/sql_db'
import { BaseLanguageModel } from 'langchain/base_language'
import { ConsoleCallbackHandler, CustomChainHandler } from '../../../src/handler'
import { DataSourceOptions } from 'typeorm/data-source'

type DatabaseType = 'sqlite' | 'postgres' | 'mssql' | 'mysql'

class SqlDatabaseChain_Chains implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'Sql Database Chain'
        this.name = 'sqlDatabaseChain'
        this.version = 1.0
        this.type = 'SqlDatabaseChain'
        this.icon = 'sqlchain.svg'
        this.category = 'Chains'
        this.description = 'Answer questions over a SQL database'
        this.baseClasses = [this.type, ...getBaseClasses(SqlDatabaseChain)]
        this.inputs = [
            {
                label: 'Language Model',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: 'Database',
                name: 'database',
                type: 'options',
                options: [
                    {
                        label: 'SQLite',
                        name: 'sqlite'
                    },
                    {
                        label: 'PostgreSQL',
                        name: 'postgres'
                    },
                    {
                        label: 'MSSQL',
                        name: 'mssql'
                    },
                    {
                        label: 'MySQL',
                        name: 'mysql'
                    }
                ],
                default: 'sqlite'
            },
            {
                label: 'Connection string or file path (sqlite only)',
                name: 'url',
                type: 'string',
                placeholder: '1270.0.0.1:5432/chinook'
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const databaseType = nodeData.inputs?.database as DatabaseType
        const model = nodeData.inputs?.model as BaseLanguageModel
        const url = nodeData.inputs?.url

        const chain = await getSQLDBChain(databaseType, url, model)
        return chain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string> {
        const databaseType = nodeData.inputs?.database as DatabaseType
        const model = nodeData.inputs?.model as BaseLanguageModel
        const url = nodeData.inputs?.url

        const chain = await getSQLDBChain(databaseType, url, model)
        const loggerHandler = new ConsoleCallbackHandler(options.logger)

        if (options.socketIO && options.socketIOClientId) {
            const handler = new CustomChainHandler(options.socketIO, options.socketIOClientId, 2)
            const res = await chain.run(input, [loggerHandler, handler])
            return res
        } else {
            const res = await chain.run(input, [loggerHandler])
            return res
        }
    }
}

const getSQLDBChain = async (databaseType: DatabaseType, url: string, llm: BaseLanguageModel) => {
    const datasource = new DataSource(
        databaseType === 'sqlite'
            ? {
                  type: databaseType,
                  database: url
              }
            : ({
                  type: databaseType,
                  url: url
              } as DataSourceOptions)
    )

    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource
    })

    const obj: SqlDatabaseChainInput = {
        llm,
        database: db,
        verbose: process.env.DEBUG === 'true' ? true : false
    }

    const chain = new SqlDatabaseChain(obj)
    return chain
}

module.exports = { nodeClass: SqlDatabaseChain_Chains }
