import { MediaType } from '../schemas/post-media.schema';
export declare class CreatePostMediaDto {
    url: string;
    type: MediaType;
    order_index?: number;
}
