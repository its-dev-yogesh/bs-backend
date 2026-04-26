"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    userModel;
    cacheManager;
    constructor(userModel, cacheManager) {
        this.userModel = userModel;
        this.cacheManager = cacheManager;
    }
    async create(createUserDto) {
        const existingUser = await this.userModel.findOne({
            $or: [{ email: createUserDto.email }, { username: createUserDto.username }],
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email or username already exists');
        }
        const password_hash = await bcrypt.hash(createUserDto.password, 10);
        const { password, ...userPayload } = createUserDto;
        const createdUser = new this.userModel({
            ...userPayload,
            password_hash,
        });
        const savedUser = await createdUser.save();
        await this.cacheManager.del('all_users');
        return this.sanitizeUser(savedUser);
    }
    async findAll() {
        const cacheKey = 'all_users';
        const cachedUsers = await this.cacheManager.get(cacheKey);
        if (cachedUsers) {
            console.log('Returning users from cache');
            return cachedUsers;
        }
        console.log('Fetching users from database');
        const users = await this.userModel.find().exec();
        await this.cacheManager.set(cacheKey, users, 300000);
        return users.map(user => this.sanitizeUser(user));
    }
    async findById(id) {
        const cacheKey = `user_${id}`;
        const cachedUser = await this.cacheManager.get(cacheKey);
        if (cachedUser) {
            console.log(`Returning user ${id} from cache`);
            return cachedUser;
        }
        console.log(`Fetching user ${id} from database`);
        const user = await this.userModel.findOne({ _id: id }).exec();
        if (user) {
            const sanitized = this.sanitizeUser(user);
            await this.cacheManager.set(cacheKey, sanitized, 300000);
            return sanitized;
        }
        return null;
    }
    async findByUsername(username) {
        const cacheKey = `user_username_${username}`;
        const cachedUser = await this.cacheManager.get(cacheKey);
        if (cachedUser) {
            console.log(`Returning user with username ${username} from cache`);
            return cachedUser;
        }
        console.log(`Fetching user with username ${username} from database`);
        const user = await this.userModel.findOne({ username }).exec();
        if (user) {
            const sanitized = this.sanitizeUser(user);
            await this.cacheManager.set(cacheKey, sanitized, 300000);
            return sanitized;
        }
        return null;
    }
    async findByEmail(email) {
        const cacheKey = `user_email_${email}`;
        const cachedUser = await this.cacheManager.get(cacheKey);
        if (cachedUser) {
            console.log(`Returning user with email ${email} from cache`);
            return cachedUser;
        }
        console.log(`Fetching user with email ${email} from database`);
        const user = await this.userModel.findOne({ email }).exec();
        if (user) {
            const sanitized = this.sanitizeUser(user);
            await this.cacheManager.set(cacheKey, sanitized, 300000);
            return sanitized;
        }
        return null;
    }
    async update(id, updateUserDto) {
        const { password, ...updatePayload } = updateUserDto;
        if (password) {
            updatePayload['password_hash'] = await bcrypt.hash(password, 10);
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updatePayload, { new: true })
            .exec();
        await this.cacheManager.del(`user_${id}`);
        if (updateUserDto.email) {
            await this.cacheManager.del(`user_email_${updateUserDto.email}`);
        }
        if (updateUserDto.username) {
            await this.cacheManager.del(`user_username_${updateUserDto.username}`);
        }
        await this.cacheManager.del('all_users');
        return updatedUser ? this.sanitizeUser(updatedUser) : null;
    }
    async remove(id) {
        await this.userModel.findByIdAndDelete(id).exec();
        await this.cacheManager.del(`user_${id}`);
        await this.cacheManager.del('all_users');
    }
    async verifyPassword(password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
    sanitizeUser(user) {
        const sanitized = user.toObject ? user.toObject() : user;
        delete sanitized.password_hash;
        return sanitized;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], UsersService);
//# sourceMappingURL=users.service.js.map