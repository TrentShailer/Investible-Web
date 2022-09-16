type Competition = {
	id: string;
	start_date: string;
	end_date: string;
	details: string;
	title: string;
};

type LeaderboardRow = {
	id: string;
	name: string;
	portfolio_value: number;
};

type DetailedLeaderboardRow = {
	leaderboard_id: string;
	name: string;
	portfolio_value: number;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	mobile: string | null;
	agree: boolean | null;
	player_id: string;
	mobile_device: boolean;
	clicked_contact: string;
	game_id: string;
	game_version: string | null;
	game_end_reason: string | null;
	game_time: number | null;
	positive_event_count: number | null;
	negative_event_count: number | null;
	game_portfolio_value: number | null;
	insurance_count: number | null;
	low_risk_count: number | null;
	high_risk_count: number | null;
	turns: number | null;
	timestamp: string;
};

type PlayerCount = {
	Date: string;
	Players: number;
};

type CategoryValue = {
	name: string;
	value: number;
};

type GameAnalytics = {
	label: string;
	allPlayers: number;
	topPlayers: number;
};

type HistogramData = {
	count: number;
	range: string;
};
