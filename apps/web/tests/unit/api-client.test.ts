import { describe, it, expect } from "vitest";
import { ApiError, mockFetch } from "@/lib/api/api-client";

describe("API Client & Error Handling Suite", () => {
  it("should create structured ApiError with status code and details", () => {
    const error = new ApiError(403, "Access Denied: Insufficient permissions", {
      requiredRole: "Admin",
    });

    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Access Denied: Insufficient permissions");
    expect(error.name).toBe("ApiError");
    expect(error.details).toEqual({ requiredRole: "Admin" });
  });

  it("should simulate network delay and return typed ApiResponse on success", async () => {
    const payload = { id: "order_123", amount: 450.0 };
    const res = await mockFetch(payload, 10);

    expect(res.status).toBe(200);
    expect(res.success).toBe(true);
    expect(res.data).toEqual(payload);
  });

  it("should throw ApiError when simulated failure is triggered", async () => {
    await expect(
      mockFetch({ status: "failed" }, 10, true, "Simulated gateway outage")
    ).rejects.toThrow("Simulated gateway outage");
  });
});
