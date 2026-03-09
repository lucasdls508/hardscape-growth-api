"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOptionalFilesDestination = exports.GetFilesDestination = exports.GetFileDestination = exports.GetConversation = exports.GetReceiver = exports.GetUserInformation = exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
const node_path_1 = __importDefault(require("node:path"));
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
exports.GetUserInformation = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.userInfo;
});
exports.GetReceiver = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.receiver;
});
exports.GetConversation = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.receiver;
});
exports.GetFileDestination = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const file = req.file;
    if (!file) {
        throw new common_1.BadRequestException("File not found in request");
    }
    const length = file.path.split("/").length;
    return file.path.split("/").slice(1, length).join("/");
});
function fileDestinations({ images }) {
    console.log(images);
    if (!images) {
        return [];
    }
    return images.map((file) => {
        const normalized = node_path_1.default.normalize(file.path);
        const parts = normalized.split(node_path_1.default.sep);
        return parts.slice(1).join("/");
    });
}
exports.GetFilesDestination = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const file = req.files;
    if (!file) {
        throw new common_1.BadRequestException("File not found in request");
    }
    const image = fileDestinations({ images: file.images });
    return image;
});
exports.GetOptionalFilesDestination = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const file = req.files;
    if (!file) {
        throw new common_1.BadRequestException("File not found in request");
    }
    if (!file.images || file.images.length === 0) {
        return [];
    }
    else {
        return fileDestinations({ images: file.images });
    }
});
//# sourceMappingURL=get-user.decorator.js.map