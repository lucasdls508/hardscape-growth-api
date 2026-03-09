"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const common_1 = require("@nestjs/common");
async function runMigrations(dataSource, exitOnFailure = false) {
    const logger = new common_1.Logger("MigrationRunner");
    try {
        logger.log("Initializing database connection");
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
        logger.log("Running pending migrations");
        const migrations = await dataSource.runMigrations();
        if (migrations.length > 0) {
            logger.log(`Successfully applied ${migrations.length} migrations:`);
            migrations.forEach((migration) => logger.log(`    - ${migration.name}`));
        }
        else {
            logger.log("No pending migrations to run");
        }
    }
    catch (error) {
        logger.error(`Migration error: ${error.message}`);
        logger.error(`Stack trace: ${error.stack}`);
        logger.error("Application startup failed due to migration errors");
        if (exitOnFailure) {
            process.exit(1);
        }
        else {
            logger.warn("Continuing application startup despite migration failure");
        }
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            logger.log("Database connection closed");
        }
    }
}
//# sourceMappingURL=migration-runner.js.map