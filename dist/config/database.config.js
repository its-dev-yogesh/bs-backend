"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConfig = void 0;
const mongooseConfig = async (configService) => ({
    uri: configService.get('MONGODB_URI'),
    user: configService.get('MONGODB_USER'),
    pass: configService.get('MONGODB_PASSWORD'),
    dbName: configService.get('MONGODB_DATABASE'),
});
exports.mongooseConfig = mongooseConfig;
//# sourceMappingURL=database.config.js.map