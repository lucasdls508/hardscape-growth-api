"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSecretsFromAWS = loadSecretsFromAWS;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const config_1 = require("@nestjs/config");
exports.default = async () => {
    return await loadSecretsFromAWS();
};
async function loadSecretsFromAWS() {
    try {
        const configService = new config_1.ConfigService();
        const client = new client_secrets_manager_1.SecretsManagerClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        const command = new client_secrets_manager_1.GetSecretValueCommand({ SecretId: process.env.AWS_SECRET_NAME });
        const response = await client.send(command);
        if ("SecretString" in response) {
            const secrets = JSON.parse(response.SecretString);
            Object.keys(secrets).forEach((key) => {
                configService.set(key, secrets[key]);
            });
        }
        else {
            throw new Error("Secret not found");
        }
    }
    catch (error) {
        console.error(`Failed to load secrets`, error);
        throw error;
    }
}
//# sourceMappingURL=app.config.js.map