import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

const firebaseAppProvider = {
    provide: 'FIREBASE_APP',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const firebaseConfig = {
            projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
            clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
            privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        };

        if (!admin.apps.length) {
            if (firebaseConfig.projectId && firebaseConfig.privateKey) {
                return admin.initializeApp({
                    credential: admin.credential.cert(firebaseConfig),
                });
            } else {
                // Initialize without credentials (e.g. for testing or fallback to default credentials)
                return null; // or throw an error depending on strictness
            }
        }
        return admin.app();
    },
};

const firebaseAuthProvider = {
    provide: 'FIREBASE_AUTH',
    inject: ['FIREBASE_APP'],
    useFactory: (app: admin.app.App | null) => {
        if (!app) return null;
        return app.auth();
    }
}

@Module({
    imports: [ConfigModule],
    providers: [firebaseAppProvider, firebaseAuthProvider],
    exports: [firebaseAppProvider, firebaseAuthProvider],
})
export class FirebaseModule { }
