
CREATE TABLE "player" (
	"id" UUID PRIMARY KEY NOT NULL,
	"mobile" BOOLEAN NOT NULL,
	"clicked_contact" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "competition" (
	"id" UUID PRIMARY KEY NOT NULL,
	"start_date" TIMESTAMPZ NOT NULL,
	"end_date" TIMESTAMPZ NOT NULL,
	"details" VARCHAR NOT NULL,
	"final_leaderboard" JSONB
);

CREATE TABLE "leaderboard" (
	"id" UUID PRIMARY KEY NOT NULL,
	"name" VARCHAR NOT NULL,
	"portfolio_value" INT NOT NULL,
	"email" VARCHAR,
	"game_id" UUID NOT NULL,
	"player_id" UUID UNIQUE NOT NULL,
	CONSTRAINT "FK_game_id" FOREIGN KEY("game_id") REFERENCES "player"("id"),
	CONSTRAINT "FK_player_id" FOREIGN KEY("player_id") REFERENCES "game"("id")
);
CREATE INDEX "IDX_leaderboard_portfolio_value" ON "leaderboard" ("portfolio_value");

CREATE TABLE "game" (
	"id" UUID PRIMARY KEY NOT NULL,
	"player_id" UUID,
	"game_version" VARCHAR,
	"game_end_reason" INT,
	"game_time" FLOAT,
	"positive_event_count" INT,
	"negative_event_count" INT,
	"portfolio_value" INT,
	"insurance_count" INT,
	"low_risk_count" INT,
	"high_risk_count" INT,
	"turns" INT,
	"timestamp" TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "FK_player_id" FOREIGN KEY("player_id") REFERENCES "player"
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
