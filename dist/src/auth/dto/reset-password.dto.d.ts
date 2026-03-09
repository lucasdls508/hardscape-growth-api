export declare class ResetPasswordDto {
    password: string;
    passwordConfirm: string;
}
export declare class UpdatePassword extends ResetPasswordDto {
    passwordCurrent: string;
}
