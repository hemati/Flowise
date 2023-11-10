import { MigrationInterface, QueryRunner } from 'typeorm'

export class ModifyAssistantEntity1699634058000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assistant" ADD "userid" varchar`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the 'userid' column from the 'assistant' table.
        await queryRunner.query(`ALTER TABLE "assistant" DROP COLUMN "userid"`)
    }
}
