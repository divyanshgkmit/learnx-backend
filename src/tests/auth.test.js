import request from "supertest";
import app from "../server.js";
import { setupTestDB, cleanupTestDB } from "./setupTestDB.js";

jest.setTimeout(30000);

let studentToken;
let instructorToken;

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await cleanupTestDB();
});

describe("User Registration", () => {
  it("should register a student successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Test Student",
      email: "student@test.com",
      password: "password123",
      role: "Student",
    });
    expect(res.status).toBe(201);
  });

  it("should register an instructor successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Test Instructor",
      email: "instructor@test.com",
      password: "password123",
      role: "Instructor",
    });
    expect(res.status).toBe(201);
  });

  it("should fail for duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      fullName: "User One",
      email: "duplicate@test.com",
      password: "password123",
      role: "Student",
    });

    const res = await request(app).post("/api/auth/register").send({
      fullName: "User Two",
      email: "duplicate@test.com",
      password: "password123",
      role: "Student",
    });
    expect(res.status).toBe(409);
  });

  it("should fail for invalid email format", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Bad Email",
      email: "invalid-email",
      password: "password123",
      role: "Student",
    });
    expect(res.status).toBe(400);
  });
});

describe("User Login", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      fullName: "Login Student",
      email: "login-student@test.com",
      password: "password123",
      role: "Student",
    });

    await request(app).post("/api/auth/register").send({
      fullName: "Login Instructor",
      email: "login-instructor@test.com",
      password: "password123",
      role: "Instructor",
    });
  });

  it("should login student successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login-student@test.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    studentToken = res.body.data.token;
  });

  it("should login instructor successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login-instructor@test.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    instructorToken = res.body.data.token;
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login-student@test.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("should fail login with empty credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "",
      password: "",
    });
    expect(res.status).toBe(400);
  });
});

describe("Authorization", () => {
  it("student should access student routes", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.status).not.toBe(403);
  });

  it("instructor should access instructor routes", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${instructorToken}`);
    expect(res.status).not.toBe(403);
  });

  it("student should not access instructor routes", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.status).toBe(403);
  });
});

describe("/me Endpoint", () => {
  it("should return logged-in student info", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.status).toBe(200);
  });

  it("should return logged-in instructor info", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${instructorToken}`);
    expect(res.status).toBe(200);
  });

  it("should fail if token is missing", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});