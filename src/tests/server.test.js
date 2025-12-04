import request from "supertest";
import app from "../server.js";
import { setupTestDB, cleanupTestDB } from "./setupTestDB.js";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await cleanupTestDB();
});

describe("Server Health Check", () => {
  it("should return API health status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("LearnX LMS API is running");
  });
});
