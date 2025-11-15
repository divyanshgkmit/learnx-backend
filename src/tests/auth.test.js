import request from "supertest";
import app from "../server.js";
import User from "../models/User.js";
import UserRole from "../models/UserRole.js";
import mongoose from "mongoose";

jest.setTimeout(30000);

describe("Authentication API Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await UserRole.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new student successfully", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullName: "Test Student",
        email: "student@test.com",
        password: "password123",
        role: "Student",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it("should not register user with duplicate email", async () => {
      await request(app).post("/api/auth/register").send({
        fullName: "Test User",
        email: "duplicate@test.com",
        password: "password123",
        role: "Student",
      });

      const response = await request(app).post("/api/auth/register").send({
        fullName: "Test User 2",
        email: "duplicate@test.com",
        password: "password123",
        role: "Student",
      });

      expect(response.status).toBe(409);
    });

    it("should not register user with invalid role", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullName: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "Admin",
      });

      expect(response.status).toBe(400);
    });

    it("should not register user with invalid email format", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullName: "Test User",
        email: "invalid-email",
        password: "password123",
        role: "Student",
      });

      expect(response.status).toBe(400);
    });

    it("should not register user with short password", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullName: "Test User",
        email: "test@test.com",
        password: "123",
        role: "Student",
      });

      expect(response.status).toBe(400);
    });

    it("should not register user without required fields", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullName: "Test User",
        // email missing
        password: "password123",
        role: "Student",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        fullName: "Test User",
        email: "login@test.com",
        password: "password123",
        role: "Student",
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "login@test.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should not login with wrong password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "login@test.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
    });

    it("should not login with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@test.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
    });

    it("should not login without email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
    });

    it("should not login without password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "login@test.com",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({
          fullName: "Test User",
          email: "me@test.com",
          password: "password123",
          role: "Student",
        });

      token = registerResponse.body.data.token;
    });

    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should not get profile without token", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
    });

    it("should not get profile with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(401);
    });
  });
});