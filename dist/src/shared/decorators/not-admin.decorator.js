"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotAdmin = IsNotAdmin;
const class_validator_1 = require("class-validator");
function IsNotAdmin(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: "IsNotAdmin",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: `${propertyName} can not be admin`,
                ...validationOptions,
            },
            validator: {
                validate(value) {
                    return value?.toLowerCase() !== "admin";
                },
            },
        });
    };
}
//# sourceMappingURL=not-admin.decorator.js.map