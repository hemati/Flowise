import { MigrationInterface, QueryRunner } from 'typeorm'

export class ModifyVariables1703958911000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variable" ADD "userid" varchar`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the 'userid' column from the 'assistant' table.
        await queryRunner.query(`ALTER TABLE "variable" DROP COLUMN "userid"`)
    }
}
