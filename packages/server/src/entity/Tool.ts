/* eslint-disable */
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { ITool } from '../Interface'

@Entity()
export class Tool implements ITool {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ type: 'text' })
    description: string

    @Column()
    color: string

    @Column({ nullable: true })
    iconSrc?: string

    @Column({ nullable: true })
    schema?: string

    @Column({ nullable: true })
    func?: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date

    @Column()
    userid: string
}
