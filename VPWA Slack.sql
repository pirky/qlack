CREATE TYPE "notification_types" AS ENUM (
  'all',
  'tagged'
);

CREATE TYPE "user_states" AS ENUM (
  'online',
  'DND',
  'offline'
);

CREATE TYPE "channel_states" AS ENUM (
  'private',
  'public',
  'direct'
);

CREATE TABLE "users" (
  "id" bigint,
  "first_name" varchar,
  "last_name" varchar,
  "nickname" varchar UNIQUE,
  "email" varchar,
  "password" hash,
  "notification_type" notification_types,
  "active_state" user_states,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "channels" (
  "id" bigint,
  "name" varchar UNIQUE,
  "state" channel_states,
  "created_by" bigint,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "user_channels" (
  "id" bigint,
  "user_id" bigint,
  "channel_id" bigint,
  "invited_at" timestamp,
  "joined_at" timestamp,
  "kicked_at" timestamp,
  "banned_at" timestamp,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "user_channel_kicks" (
  "id" bigint,
  "user_id" bigint,
  "kicker_id" bigint,
  "channel_id" bigint,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "messages" (
  "id" bigint,
  "author_id" bigint,
  "channel_id" bigint,
  "content" varchar,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

ALTER TABLE "channels" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "user_channels" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_channels" ADD FOREIGN KEY ("channel_id") REFERENCES "channels" ("id");

ALTER TABLE "user_channel_kicks" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_channel_kicks" ADD FOREIGN KEY ("channel_id") REFERENCES "channels" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("channel_id") REFERENCES "channels" ("id");
