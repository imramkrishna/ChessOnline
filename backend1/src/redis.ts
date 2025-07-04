import { Redis } from '@upstash/redis'
async function connectRedis() {
    const redis = new Redis({
        url: 'https://ethical-pegasus-10842.upstash.io',
        token: 'ASpaAAIjcDE5NDA1ZDdmMWYyYTQ0NTZkOGRhMjlkOGQ0YTg4ZjExZnAxMA',
    })

    await redis.set("foo", "bar");
    await redis.get("foo");
}
