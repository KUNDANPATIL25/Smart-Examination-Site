package com.aiexam.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Keeps one token bucket per client IP so we never hammer the free-tier
 * Gemini API quota. Buckets live in memory - fine for a single-instance
 * deployment; swap for a Redis-backed Bucket4j proxy manager if you scale out.
 */
@Component
public class RateLimitConfig {

    @Value("${ratelimit.capacity}")
    private int capacity;

    @Value("${ratelimit.refill-tokens}")
    private int refillTokens;

    @Value("${ratelimit.refill-duration-minutes}")
    private int refillDurationMinutes;

    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String clientKey) {
        return buckets.computeIfAbsent(clientKey, key -> newBucket());
    }

    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.classic(capacity,
                Refill.intervally(refillTokens, Duration.ofMinutes(refillDurationMinutes)));
        return Bucket.builder().addLimit(limit).build();
    }
}
