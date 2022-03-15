CREATE TYPE "notification_types" AS ENUM (
  'all',
  'tagged'
);

CREATE TYPE "user_states" AS ENUM (
  'online',
  'DND',
  'offline'
);

CREATE TYPE "user_channel_states" AS ENUM (
  'invited',
  'joined',
  'kicked',
  'banned'
);

CREATE TABLE "users" (
  "id" bigint,
  "first_name" varchar,
  "last_name" varchar,
  "nickname" varchar UNIQUE,
  "avatar_path" varchar,
  "email" varchar,
  "password" hash,
  "notification_type" notification_types,
  "state" user_states,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "channels" (
  "id" bigint,
  "name" varchar UNIQUE,
  "private" bool,
  "created_by" bigint,
  "message_count" bigint,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "user_channels" (
  "id" bigint,
  "user_id" bigint,
  "group_id" bigint,
  "state" user_channel_states,
  "last_read_message" bigint,
  "last_message_count" bigint,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "user_channel_kicks" (
  "id" bigint,
  "user_id" bigint,
  "kicker_id" bigint,
  "group_id" bigint,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "channel_messages" (
  "id" bigint,
  "author_id" bigint,
  "group_id" bigint,
  "send_time" timestamp,
  "content" varchar,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "direct_messages" (
  "id" bigint,
  "author_id" bigint,
  "receiver_id" bigint,
  "send_time" timestamp,
  "content" varchar,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "user_directs" (
  "id" bigint,
  "user_id" bigint,
  "other_user_id" bigint,
  "blocked" boolean,
  "last_read_message" bigint,
  "last_message_count" bigint,
  "created_at" timestamp,
  "updated_at" timestamp,
  "deleted_at" timestamp
);

ALTER TABLE "channels" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "user_channels" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_channels" ADD FOREIGN KEY ("group_id") REFERENCES "channels" ("id");

ALTER TABLE "user_channels" ADD FOREIGN KEY ("last_read_message") REFERENCES "channel_messages" ("id");

ALTER TABLE "user_channel_kicks" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_channel_kicks" ADD FOREIGN KEY ("group_id") REFERENCES "channels" ("id");

ALTER TABLE "channel_messages" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id");

ALTER TABLE "channel_messages" ADD FOREIGN KEY ("group_id") REFERENCES "channels" ("id");

ALTER TABLE "direct_messages" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id");

ALTER TABLE "direct_messages" ADD FOREIGN KEY ("receiver_id") REFERENCES "users" ("id");

ALTER TABLE "user_directs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_directs" ADD FOREIGN KEY ("other_user_id") REFERENCES "users" ("id");

ALTER TABLE "user_directs" ADD FOREIGN KEY ("last_read_message") REFERENCES "direct_messages" ("id");
