"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pagination_1 = require("../shared/utils/pagination");
const typeorm_2 = require("typeorm");
const notifications_entity_1 = require("./entities/notifications.entity");
let NotificationsService = class NotificationsService {
    constructor(_notificationsRepository) {
        this._notificationsRepository = _notificationsRepository;
    }
    async createNotification({ recepient_id, actor_id, related, action, type = notifications_entity_1.NotificationType.INFO, msg, targetId, notificationFor, isImportant = false, }) {
        const notification = this._notificationsRepository.create({
            recepient: { id: recepient_id },
            actor: { id: actor_id },
            related,
            action,
            type,
            msg,
            target_id: targetId,
            notificationFor,
            isImportant,
        });
        return await this._notificationsRepository.save(notification);
    }
    async bulkInsertNotifications(notificationsData) {
        const notifications = notificationsData.map((data) => {
            return this._notificationsRepository.create({
                recepient: { id: data.recepient_id },
                actor: { id: data.actor_id },
                related: data.related,
                action: data.action,
                type: data.type || notifications_entity_1.NotificationType.INFO,
                msg: data.msg,
                target_id: data.targetId,
                notificationFor: data.notificationFor,
                isImportant: data.isImportant || false,
            });
        });
        return await this._notificationsRepository.save(notifications);
    }
    async getNotifications({ recepient_id, page, limit, notificationFor, }) {
        const skip = (page - 1) * limit;
        const take = limit;
        const query = this._notificationsRepository.createQueryBuilder("notification");
        if (recepient_id) {
            query.where("notification.recepient_id = :recepient_id", { recepient_id });
        }
        if (notificationFor) {
            query.andWhere("notification.notificationFor = :notificationFor", { notificationFor });
        }
        query.skip(skip).take(take).orderBy("notification.created_at", "DESC");
        const [notifications, total] = await query.getManyAndCount();
        const data = notifications.map((notification) => ({
            id: notification.id,
            msg: notification.msg,
            related: notification.related,
            recepient_id: notification.recepient,
            action: notification.action,
            type: notification.type,
            target_id: notification.target_id,
            isRead: notification.isRead,
            isImportant: notification.isImportant,
            created_at: notification.created_at.toISOString(),
            updated_at: notification.updated_at.toISOString(),
        }));
        return {
            message: "Notifications retrieved successfully",
            statusCode: 200,
            data,
            pagination: (0, pagination_1.pagination)({ page, limit, total }),
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notifications_entity_1.Notifications)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map