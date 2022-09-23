-- New browser
INSERT INTO browser VALUES ('3f48c402-2c0f-4f2c-992c-6d85a1330b0d', FALSE);
-- Plays a game
INSERT INTO game VALUES (
	'3801909d-1b84-4b6c-8eb0-7efd3fd04c43',
	null,
	'1.0.0',
	0,
	0.0,
	0,
	0,
	320000,
	0,
	0,
	0,
	0
);
-- Goes to submit a score
INSERT INTO player VALUES (
	'c7571f62-c611-40de-ba42-feb21cbc8676',
	'John Smith',
	'John',
	'Smith',
	'john.smith@gmail.com',
	'07123456789',
	TRUE
);
-- Update player_id in browser
UPDATE browser SET player_id = 'c7571f62-c611-40de-ba42-feb21cbc8676' WHERE id = '3f48c402-2c0f-4f2c-992c-6d85a1330b0d';
-- Update player_id in game
UPDATE game SET player_id = 'c7571f62-c611-40de-ba42-feb21cbc8676' WHERE id = '3801909d-1b84-4b6c-8eb0-7efd3fd04c43';
-- Create leaderboard entry
INSERT INTO leaderboard VALUES (
	'c8a2b08b-cb76-416b-ac89-ad67dc31cb08',
	'c7571f62-c611-40de-ba42-feb21cbc8676',
	'3801909d-1b84-4b6c-8eb0-7efd3fd04c43'
);
-- Same player plays another game
INSERT INTO game VALUES (
	'85ae9522-4177-47df-86ea-bef911cf4148',
	'c7571f62-c611-40de-ba42-feb21cbc8676',
	'1.0.0',
	0,
	0.0,
	0,
	0,
	350000,
	0,
	0,
	0,
	0
);
-- Update player
UPDATE player SET name = 'Smith John', first_name = 'Smith', last_name = 'John', email = 'smith.john@gmail.com', mobile = '07987654321' WHERE id = 'c7571f62-c611-40de-ba42-feb21cbc8676';
-- Create leaderboard entry
INSERT INTO leaderboard VALUES (
	'ba745c04-0db0-41fa-a4e7-3b4fec476d11',
	'c7571f62-c611-40de-ba42-feb21cbc8676',
	'85ae9522-4177-47df-86ea-bef911cf4148'
);
-- SELECT DISTINCT ON (leaderboard.player_id) leaderboard.id, game.portfolio_value FROM leaderboard INNER JOIN game ON leaderboard.game_id = game.id ORDER BY leaderboard.player_id DESC, portfolio_value DESC;

