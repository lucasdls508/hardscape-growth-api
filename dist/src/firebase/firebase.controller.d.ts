import { FirebaseService } from './firebase.service';
export declare class FirebaseController {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    sendNotification(body: {
        token: string;
        title: string;
        body: string;
        data?: any;
    }): Promise<string>;
}
