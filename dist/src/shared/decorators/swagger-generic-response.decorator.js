"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSuccessResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_response_dto_1 = require("../dto/base-response.dto");
const params = { isArray: false };
const ApiSuccessResponse = (model, description = "Successful response", options = params) => {
    if (options.isArray) {
        return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(base_response_dto_1.CountApiResponseDto, model), (0, swagger_1.ApiOkResponse)({
            description,
            schema: {
                allOf: [
                    { $ref: (0, swagger_1.getSchemaPath)(base_response_dto_1.CountApiResponseDto) },
                    {
                        properties: {
                            data: { type: "array", items: { $ref: (0, swagger_1.getSchemaPath)(model) } },
                            count: {
                                type: "number",
                                description: "Total count of items",
                            },
                        },
                    },
                ],
            },
        }));
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(base_response_dto_1.ApiResponseDto, model), (0, swagger_1.ApiOkResponse)({
        description,
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(base_response_dto_1.ApiResponseDto) },
                {
                    properties: {
                        data: { $ref: (0, swagger_1.getSchemaPath)(model) },
                    },
                },
            ],
        },
    }));
};
exports.ApiSuccessResponse = ApiSuccessResponse;
//# sourceMappingURL=swagger-generic-response.decorator.js.map