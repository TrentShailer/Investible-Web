CREATE TABLE "leaderboard" (
	"id" UUID PRIMARY KEY NOT NULL,
	"name" VARCHAR NOT NULL,
	"portfolio_value" INT NOT NULL,
	"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "IDX_leaderboard_portfolio_value" ON "leaderboard" ("portfolio_value");

CREATE TABLE "analytics" (
	"session_id" UUID PRIMARY KEY NOT NULL,
	"user_id" UUID,
	"game_version" VARCHAR,
	"session_end_reason" INT,
	"game_time" FLOAT,
	"portfolio_value" INT,
	"insurance_count" INT,
	"low_risk_count" INT,
	"high_risk_count" INT,
	"clicked_contact" BOOLEAN,
	"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
