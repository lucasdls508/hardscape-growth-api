"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const pug_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/pug.adapter");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const mail_service_1 = require("./mail.service");
console.log(process.env.SENDGRID_API_KEY);
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    {
                        return {
                            transport: {
                                host: "smtp.gmail.com",
                                port: 587,
                                auth: {
                                    user: configService.get("EMAIL_USERNAME"),
                                    pass: configService.get("EMAIL_PASSWORD"),
                                },
                            },
                            defaults: {
                                from: `"Hardscape Growth" <${configService.get("EMAIL_USERNAME")}>`,
                            },
                            template: {
                                dir: (0, path_1.join)(__dirname, "templates"),
                                adapter: new pug_adapter_1.PugAdapter(),
                                options: {
                                    strict: true,
                                },
                            },
                        };
                    }
                },
            }),
        ],
        providers: [mail_service_1.MailService],
        exports: [mail_service_1.MailService],
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map