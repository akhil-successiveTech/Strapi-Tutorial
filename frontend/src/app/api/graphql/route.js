import redis from "../../../../lib/redis";

export async function POST(req) {
  try {
    const body = await req.json();
    const { query, variables } = body;

    // unique cache key
    const cacheKey = `graphql:${JSON.stringify({ query, variables })}`;

    // 1️⃣ check Redis cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Redis cache HIT");
      return new Response(cached, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Redis cache MISS — fetching from Strapi");

    // 2️⃣ fetch from Strapi GraphQL
    const res = await fetch("http://localhost:1337/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const data = await res.text();

    // 3️⃣ cache in Redis for 10 minutes
    await redis.set(cacheKey, data, "EX", 60);

    // 4️⃣ return data
    return new Response(data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
