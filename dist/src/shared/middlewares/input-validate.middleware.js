"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customInputValidation = customInputValidation;
const common_1 = require("@nestjs/common");
function customInputValidation(request, response, next) {
    try {
        const requestMethod = request.method;
        let error = {};
        validateRequestUrl(request);
        switch (requestMethod) {
            case "GET":
                error = processGetRequest(request);
                break;
            case "POST":
            case "PUT":
            case "PATCH":
                error = processPostRequest(request);
                break;
        }
        if (errorExist(error))
            rejectRequest(error);
        next();
    }
    catch (e) {
        throw new common_1.HttpException(e.message, common_1.HttpStatus.FORBIDDEN);
    }
}
function validateRequestUrl(request) {
    const requestUrl = `${request.protocol}://${request.get("host")}${request.originalUrl}`;
    if (requestUrl !== null && requestUrl !== undefined) {
        const validatedUrlRes = findInjection({ request_url: requestUrl });
        if (errorExist(validatedUrlRes))
            rejectRequest(validatedUrlRes);
    }
}
function rejectRequest(error) {
    const errMessage = `Invalid content passed on ${error["requestKey"]}`;
    throw new common_1.HttpException(errMessage, common_1.HttpStatus.FORBIDDEN);
}
function processGetRequest(request) {
    let error = {};
    const requestQuery = request.query;
    if (requestQuery && Object.keys(requestQuery).length) {
        error = findInjection(requestQuery);
        if (!errorExist(error)) {
            request.query = error["sanitizedObject"];
        }
    }
    return error;
}
function errorExist(error) {
    return error && Object.keys(error).length && error["errorStatus"];
}
function processPostRequest(request) {
    let error = {};
    const bodyParams = request.body;
    if (bodyParams && Object.keys(bodyParams).length && !Array.isArray(bodyParams)) {
        error = findInjection(bodyParams);
        request.body = error["sanitizedObject"];
    }
    if (bodyParams && Array.isArray(bodyParams) && bodyParams.length) {
        for (let i = 0; i < bodyParams.length; i++) {
            error = findInjection(bodyParams[i]);
            bodyParams[i] = error["sanitizedObject"];
            if (error && Object.keys(error).length && error["errorStatus"] === true)
                break;
        }
    }
    return error;
}
function findInjection(input_params) {
    let error = { errorStatus: false };
    for (const key in input_params) {
        if (input_params.hasOwnProperty(key)) {
            const originalValue = input_params[key];
            if (originalValue || typeof originalValue === "boolean") {
                let sanitizedValue = typeof originalValue === "string" ? originalValue.replace(/%20/g, " ") : originalValue;
                if (typeof originalValue === "string") {
                    sanitizedValue = sanitizeUrl(sanitizedValue);
                    sanitizedValue = stripeHtmlScriptTags(sanitizedValue);
                    const isInjectionFound = applyInjectionRule(sanitizedValue);
                    if (isInjectionFound) {
                        error = {
                            requestKey: key,
                            errorStatus: true,
                            sanitizedObject: null,
                        };
                        break;
                    }
                    else {
                        input_params[key] = sanitizedValue;
                    }
                }
            }
        }
    }
    if (!error.errorStatus) {
        error["sanitizedObject"] = input_params;
    }
    return error;
}
function stripeHtmlScriptTags(input) {
    const htmlRegex = /<([^>]+?)([^>]*?)>(.*?)<\/\1>/gi;
    return input.replace(htmlRegex, "");
}
function applyInjectionRule(input) {
    const sql = new RegExp("w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))", "i");
    const sqlMeta = new RegExp("(%27)|(')|(--)|(%23)|(#)", "i");
    const sqlMetaVersion2 = new RegExp("((%3D)|(=))[^\n]*((%27)|(')|(--)|(%3B)|(;))", "i");
    const sqlUnion = new RegExp("((%27)|('))union", "i");
    const xssSimple = new RegExp("((%3C)|<)((%2F)|/)*[a-z0-9%]+((%3E)|>)", "i");
    const xssImgSrc = new RegExp("((%3C)|<)((%69)|i|(%49))((%6D)|m|(%4D))((%67)|g|(%47))[^\n]+((%3E)|>)", "i");
    return (sql.test(input) ||
        sqlMeta.test(input) ||
        sqlMetaVersion2.test(input) ||
        sqlUnion.test(input) ||
        xssSimple.test(input) ||
        xssImgSrc.test(input));
}
function isRelativeUrlWithoutProtocol(url) {
    return url.startsWith(".") || url.startsWith("/");
}
function sanitizeUrl(url) {
    if (!url) {
        return "about:blank";
    }
    const ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
    const sanitizedUrl = url.replace(ctrlCharactersRegex, "").trim();
    if (isRelativeUrlWithoutProtocol(sanitizedUrl)) {
        return sanitizedUrl;
    }
    const urlSchemeRegex = /^([^:]+):/gm;
    const invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
    const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
    if (urlSchemeParseResults) {
        const urlScheme = urlSchemeParseResults[0];
        if (invalidProtocolRegex.test(urlScheme)) {
            return "about:blank";
        }
    }
    return sanitizedUrl;
}
//# sourceMappingURL=input-validate.middleware.js.map