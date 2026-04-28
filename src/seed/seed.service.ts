import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserType, UserStatus } from '../users/schemas/user.schema';
import {
  Post,
  PostStatus,
  PostType,
  PostVisibility,
} from '../posts/schemas/post.schema';
import {
  PropertyListing,
  PropertyType,
  ListingType,
  FurnishingType,
} from '../posts/schemas/property-listing.schema';
import {
  PropertyRequirement,
  RequirementListingType,
} from '../posts/schemas/property-requirement.schema';
import { PostMedia, MediaType } from '../posts/schemas/post-media.schema';
import { Feed } from '../feeds/schemas/feed.schema';
import { PostsService } from '../posts/posts.service';
import { AuthTokenService } from '../auth/services/token.service';

const SEED_USERNAME_PREFIX = 'seed_';
const SEED_PHONE_PREFIX = '+910000';
const SEED_PASSWORD = 'Test@1234';

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun',
  'Sai', 'Reyansh', 'Krishna', 'Ishaan', 'Ayaan',
  'Aanya', 'Aadhya', 'Saanvi', 'Anaya', 'Diya',
  'Pari', 'Riya', 'Myra', 'Sara', 'Tara',
];

const LOCATIONS = [
  { text: 'HSR Layout, Bangalore', lat: 12.9116, lng: 77.6473 },
  { text: 'Indiranagar, Bangalore', lat: 12.9784, lng: 77.6408 },
  { text: 'Koramangala, Bangalore', lat: 12.9352, lng: 77.6245 },
  { text: 'Whitefield, Bangalore', lat: 12.9698, lng: 77.7499 },
  { text: 'BTM Layout, Bangalore', lat: 12.9166, lng: 77.6101 },
  { text: 'Jayanagar, Bangalore', lat: 12.9250, lng: 77.5938 },
  { text: 'Marathahalli, Bangalore', lat: 12.9591, lng: 77.6974 },
  { text: 'Electronic City, Bangalore', lat: 12.8456, lng: 77.6603 },
];

const PROPERTY_TYPES = [
  PropertyType.FLAT,
  PropertyType.HOUSE,
  PropertyType.VILLA,
  PropertyType.PLOT,
];

const LISTING_TITLES = [
  '3 BHK Apartment with City View',
  'Spacious 2 BHK Flat near Metro',
  '4 BHK Villa with Private Garden',
  'Premium 1 BHK Studio Apartment',
  'Newly Constructed 3 BHK House',
  'Luxury Penthouse with Terrace',
  'Cozy 2 BHK in Gated Community',
  'Modern 3 BHK with Modular Kitchen',
];

const REQUIREMENT_TITLES = [
  'Looking for 2 BHK on Rent',
  'Need 3 BHK to Buy under 1.5 Cr',
  'Searching for furnished 1 BHK',
  'Want a villa with parking',
  'Need a 4 BHK family home',
  'Looking for plot to build',
];

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
}

function unsplashUrl(seed: number, query: string): string {
  return `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&sig=${seed}`;
}

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PropertyListing.name)
    private readonly listingModel: Model<PropertyListing>,
    @InjectModel(PropertyRequirement.name)
    private readonly requirementModel: Model<PropertyRequirement>,
    @InjectModel(PostMedia.name)
    private readonly mediaModel: Model<PostMedia>,
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
    private readonly postsService: PostsService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async seedUsers(count = 10, agentRatio = 0.4) {
    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
    const created: User[] = [];
    const skipped: string[] = [];

    for (let i = 0; i < count; i++) {
      const first = pick(FIRST_NAMES, i);
      const username = `${SEED_USERNAME_PREFIX}${first.toLowerCase()}_${i + 1}`;
      const phone = `${SEED_PHONE_PREFIX}${String(i + 1).padStart(4, '0')}`;
      const isAgent = i / count < agentRatio;

      const existing = await this.userModel.findOne({ username }).exec();
      if (existing) {
        skipped.push(username);
        continue;
      }

      const user = await this.userModel.create({
        username,
        phone,
        email: `${username}@seed.local`,
        password_hash: passwordHash,
        is_verified: true,
        type: isAgent ? UserType.AGENT : UserType.USER,
        status: UserStatus.ACTIVE,
      });

      created.push(user.toObject() as User);
    }

    return {
      created: created.length,
      skipped: skipped.length,
      password: SEED_PASSWORD,
      users: created.map((u) => ({
        id: u._id,
        username: u.username,
        phone: u.phone,
        email: u.email,
        type: u.type,
      })),
    };
  }

  async seedPosts(perUser = 2) {
    const users = await this.userModel
      .find({ username: { $regex: `^${SEED_USERNAME_PREFIX}` } })
      .exec();

    if (users.length === 0) {
      throw new BadRequestException(
        'No seed users found. Call POST /seed/users first.',
      );
    }

    let listings = 0;
    let requirements = 0;
    let mediaCount = 0;
    let mediaSeed = 1;

    for (const user of users) {
      for (let i = 0; i < perUser; i++) {
        const loc = pick(LOCATIONS, listings + requirements + i);

        if (user.type === UserType.AGENT) {
          const title = pick(LISTING_TITLES, listings);
          const result = await this.postsService.createListing(
            user._id ?? '',
            UserType.AGENT,
            {
              title,
              description: `${title} in ${loc.text}. Move-in ready, well-ventilated, close to amenities.`,
              location_text: loc.text,
              latitude: loc.lat,
              longitude: loc.lng,
              visibility: PostVisibility.PUBLIC,
              status: PostStatus.ACTIVE,
              listing: {
                price: randomPrice(2_500_000, 25_000_000),
                property_type: pick(PROPERTY_TYPES, listings),
                listing_type:
                  listings % 2 === 0 ? ListingType.SALE : ListingType.RENT,
                bhk: 1 + (listings % 4),
                bathrooms: 1 + (listings % 3),
                balconies: listings % 3,
                area_sqft: 600 + ((listings * 137) % 1800),
                floor_number: (listings % 12) + 1,
                total_floors: 12 + (listings % 8),
                furnishing: pick(
                  [
                    FurnishingType.FURNISHED,
                    FurnishingType.SEMI,
                    FurnishingType.UNFURNISHED,
                  ],
                  listings,
                ),
              },
            },
          );
          listings += 1;

          const mediaToInsert = 1 + (listings % 3);
          for (let m = 0; m < mediaToInsert; m++) {
            await this.mediaModel.create({
              post_id: result.post._id,
              url: unsplashUrl(mediaSeed++, 'apartment,real-estate'),
              type: MediaType.IMAGE,
              order_index: m,
            });
            mediaCount += 1;
          }
        } else {
          const title = pick(REQUIREMENT_TITLES, requirements);
          const budgetMin = randomPrice(1_500_000, 6_000_000);
          await this.postsService.createRequirement(
            user._id ?? '',
            UserType.USER,
            {
              title,
              description: `${title}. Preferred area ${loc.text}.`,
              location_text: loc.text,
              latitude: loc.lat,
              longitude: loc.lng,
              visibility: PostVisibility.PUBLIC,
              status: PostStatus.ACTIVE,
              requirement: {
                budget_min: budgetMin,
                budget_max: budgetMin + randomPrice(500_000, 4_000_000),
                property_type: pick(PROPERTY_TYPES, requirements),
                listing_type:
                  requirements % 2 === 0
                    ? RequirementListingType.RENT
                    : RequirementListingType.BUY,
                bhk_min: 1 + (requirements % 3),
                bhk_max: 2 + (requirements % 3),
                preferred_location_text: loc.text,
                latitude: loc.lat,
                longitude: loc.lng,
              },
            },
          );
          requirements += 1;
        }
      }
    }

    return {
      users: users.length,
      listings,
      requirements,
      media: mediaCount,
      note: 'Feed fan-out is queued via BullMQ; allow a few seconds to populate /feeds.',
    };
  }

  async seedAll(usersCount = 10, postsPerUser = 2) {
    const users = await this.seedUsers(usersCount);
    const posts = await this.seedPosts(postsPerUser);
    return { users, posts };
  }

  async clearAll() {
    const seedUsers = await this.userModel
      .find({ username: { $regex: `^${SEED_USERNAME_PREFIX}` } })
      .select('_id')
      .exec();
    const userIds = seedUsers.map((u) => u._id).filter(Boolean) as string[];

    const seedPosts = await this.postModel
      .find({ user_id: { $in: userIds } })
      .select('_id')
      .exec();
    const postIds = seedPosts.map((p) => p._id).filter(Boolean) as string[];

    const [
      deletedListings,
      deletedRequirements,
      deletedMedia,
      deletedPosts,
      deletedFeeds,
      deletedUsers,
    ] = await Promise.all([
      this.listingModel.deleteMany({ post_id: { $in: postIds } }).exec(),
      this.requirementModel.deleteMany({ post_id: { $in: postIds } }).exec(),
      this.mediaModel.deleteMany({ post_id: { $in: postIds } }).exec(),
      this.postModel.deleteMany({ _id: { $in: postIds } }).exec(),
      this.feedModel
        .deleteMany({
          $or: [
            { user_id: { $in: userIds } },
            { post_id: { $in: postIds } },
          ],
        })
        .exec(),
      this.userModel.deleteMany({ _id: { $in: userIds } }).exec(),
    ]);

    return {
      users: deletedUsers.deletedCount,
      posts: deletedPosts.deletedCount,
      listings: deletedListings.deletedCount,
      requirements: deletedRequirements.deletedCount,
      media: deletedMedia.deletedCount,
      feeds: deletedFeeds.deletedCount,
    };
  }

  async devLogin(identifier: string) {
    const user = await this.userModel
      .findOne({
        $or: [{ username: identifier }, { phone: identifier }],
      })
      .exec();

    if (!user) {
      throw new NotFoundException(`No user with identifier ${identifier}`);
    }

    const tokens = this.authTokenService.generateTokens({
      sub: user._id ?? '',
      username: user.username,
      email: user.email ?? '',
      type: user.type,
    });

    return {
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        type: user.type,
      },
    };
  }
}
