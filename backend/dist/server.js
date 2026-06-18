"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./utils/prisma");
async function bootstrap() {
    try {
        await prisma_1.prisma.$connect();
        console.log('✅ Database connected');
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${env_1.env.PORT}`);
            console.log(`   Environment: ${env_1.env.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        await prisma_1.prisma.$disconnect();
        process.exit(1);
    }
}
process.on('SIGTERM', async () => {
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
bootstrap();
//# sourceMappingURL=server.js.map