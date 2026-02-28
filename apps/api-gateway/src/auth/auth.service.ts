import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as admin from 'firebase-admin';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @Inject('FIREBASE_AUTH') private readonly firebaseAuth: admin.auth.Auth,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    async verifyFirebaseToken(idToken: string) {
        try {
            const decodedToken = await this.firebaseAuth.verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid Firebase Token');
        }
    }

    async login(idToken: string) {
        const decodedToken = await this.verifyFirebaseToken(idToken);
        const { uid, email, phone_number, name, picture } = decodedToken;

        let user = await this.userModel.findOneAndUpdate(
            { firebaseUid: uid },
            {
                $setOnInsert: {
                    firebaseUid: uid,
                    email: email,
                    phoneNumber: phone_number,
                    fullName: name,
                    avatarUrl: picture,
                }
            },
            { new: true, upsert: true }
        );

        if (!user.isActive) {
            throw new UnauthorizedException('User account is deactivated');
        }

        const payload = { sub: user._id, roles: user.roles };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user,
        };
    }
}
