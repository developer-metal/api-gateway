import { Injectable } from '@nestjs/common';
import { GoogleRecaptchaException, GoogleRecaptchaValidator } from '@nestlab/google-recaptcha';

@Injectable()
export class RecaptchaService {
    private readonly recaptchaValidator: GoogleRecaptchaValidator;
    constructor(recaptchaValidator: GoogleRecaptchaValidator) {
        this.recaptchaValidator = recaptchaValidator;
    }
    async someAction(recaptchaToken: string): Promise<void> {
        const result = await this.recaptchaValidator.validate({
            response: recaptchaToken
        });
        if (!result.success) {
            throw new GoogleRecaptchaException(result.errors);
        }
    }
}
