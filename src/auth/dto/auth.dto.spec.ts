import { Auth } from "./auth.dto";
import { Test, TestingModule } from "@nestjs/testing";
describe('Auth', () => {
    let authservice: Auth; // Use a different variable name and type annotation
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Auth],
            imports: []
        }).compile();

        authservice = module.get<Auth>(Auth);
    });
    it('should have default values', () => {
        const auth = new Auth();
        const timeExpect = Number(auth.uptime).toFixed(0);
        const timeDefault = Number(process.uptime()).toFixed(0);
        const dateExpect = String(auth.date).slice(0,10);
        const DateDefault = String(new Date().toISOString()).slice(0,10);
        expect(authservice.code).toBe(200);
        expect(timeExpect).toBe(timeDefault);
        expect(dateExpect).toBe(DateDefault);
        expect(auth.message).toBe('OK');
    });
    it('should have ApiProperty decorator', () => {
        const auth = new Auth();
        expect(auth.hasOwnProperty('__metadata')).not.toBeTruthy();
    });
});