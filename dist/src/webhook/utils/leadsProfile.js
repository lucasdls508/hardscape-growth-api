"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLeadInfo = parseLeadInfo;
const leadgen_types_1 = require("../../page_session/types/leadgen.types");
function parseLeadInfo(leadInfo) {
    const obj = {};
    const fieldMap = {
        [leadgen_types_1.LeadFieldName.FULL_NAME]: (v) => (obj.name = v),
        [leadgen_types_1.LeadFieldName.EMAIL]: (v) => (obj.email = v),
        [leadgen_types_1.LeadFieldName.email]: (v) => (obj.email = v),
        [leadgen_types_1.LeadFieldName.PHONE_NUMBER]: (v) => (obj.phone = v),
        [leadgen_types_1.LeadFieldName.FIRST_NAME]: (v) => (obj.firstName = v),
        [leadgen_types_1.LeadFieldName.LAST_NAME]: (v) => (obj.lastName = v),
        [leadgen_types_1.LeadFieldName.COMPANY_NAME]: (v) => (obj.companyName = v),
        [leadgen_types_1.LeadFieldName.JOB_TITLE]: (v) => (obj.jobTitle = v),
        [leadgen_types_1.LeadFieldName.ZIP_CODE]: (v) => (obj.zipCode = v),
        [leadgen_types_1.LeadFieldName.POSTAL_CODE]: (v) => (obj.postalCode = v),
        [leadgen_types_1.LeadFieldName.full_name]: (v) => (obj.name = v),
        [leadgen_types_1.LeadFieldName.phone_number]: (v) => (obj.phone = v),
        [leadgen_types_1.LeadFieldName.zip_code]: (v) => (obj.zipCode = v),
        [leadgen_types_1.LeadFieldName.postal_code]: (v) => (obj.postalCode = v),
        [leadgen_types_1.LeadFieldName.name]: (v) => (obj.name = v),
        [leadgen_types_1.LeadFieldName.job_title]: (v) => (obj.jobTitle = v),
    };
    leadInfo.field_data.forEach(({ name, values }) => {
        const value = values?.[0];
        if (!value)
            return;
        fieldMap[name]?.(value);
    });
    return obj;
}
//# sourceMappingURL=leadsProfile.js.map