"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const user_service_1 = require("../user/user.service");
let FirebaseService = FirebaseService_1 = class FirebaseService {
    constructor(userService) {
        this.userService = userService;
        this.logger = new common_1.Logger(FirebaseService_1.name);
        if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        type: process.env.FIREBASE_TYPE,
                        project_id: process.env.FIREBASE_PROJECT_ID,
                        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                        client_email: process.env.FIREBASE_CLIENT_EMAIL,
                        client_id: process.env.FIREBASE_CLIENT_ID,
                        auth_uri: process.env.FIREBASE_AUTH_URI,
                        token_uri: process.env.FIREBASE_TOKEN_URI,
                        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
                        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
                        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
                    }),
                });
                this.logger.log("Firebase Admin initialized.");
            }
            catch (err) {
                this.logger.warn(`Firebase not configured — push notifications disabled: ${err.message}`);
            }
        }
        else if (!process.env.FIREBASE_PROJECT_ID) {
            this.logger.warn("Firebase not configured — push notifications disabled.");
        }
    }
    async sendPushNotification(token, title, body) {
        const message = {
            notification: { title, body },
            token,
        };
        try {
            const response = await admin.messaging().send(message);
            this.logger.log(`Message sent: ${response}`);
            return response;
        }
        catch (error) {
            this.logger.error("Failed to send push notification", error.stack || error);
            return null;
        }
    }
    async sendPushNotificationToMultiple(tokens, title, body) {
        const message = {
            notification: { title, body },
            tokens,
        };
        try {
            const response = await admin.messaging().sendEachForMulticast(message);
            this.logger.log(`Multicast message sent: ${response.successCount} succeeded, ${response.failureCount} failed`);
            return response;
        }
        catch (error) {
            this.logger.error("Failed to send multicast push notification", error.stack || error);
            return null;
        }
    }
    async findUserFcmAndSendPushNotification({ userId, title, body, }) {
        const user = await this.userService.getUserById(userId);
        if (user.fcm) {
            await this.sendPushNotification(user.fcm, title, body);
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map