"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = require("../utils/prisma");
const env_1 = require("./env");
if (env_1.env.GOOGLE_CLIENT_ID && env_1.env.GOOGLE_CLIENT_SECRET && env_1.env.GOOGLE_CALLBACK_URL) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: env_1.env.GOOGLE_CLIENT_ID,
        clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
        callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
                return done(new Error('No email found in Google profile'));
            }
            const user = await prisma_1.prisma.user.upsert({
                where: { googleId: profile.id },
                update: {
                    name: profile.displayName,
                    avatar: profile.photos?.[0]?.value,
                    lastActiveAt: new Date(),
                },
                create: {
                    googleId: profile.id,
                    email,
                    name: profile.displayName,
                    avatar: profile.photos?.[0]?.value,
                },
            });
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
}
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map