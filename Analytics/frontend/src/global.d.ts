type LeaderboardRow = {
	id: string;
	name: string;
	portfolio_value: number;
};

type DetailedLeaderboardRow = {
	id: string;
	name: string;
	portfolio_value: number;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	mobile: string | null;
	player_info: PlayerInfo;
	game_info: GameInfo;
};

type GameInfo = {
	game_version: string;
	game_end_reason: string;
	game_time: number;
	positive_event_count: number;
	negative_event_count: number;
	portfolio_value: number;
	insurance_count: number;
	low_risk_count: number;
	high_risk_count: number;
	turns: number;
	timestamp: string;
};

type PlayerInfo = {
	mobile: boolean;
	clicked_contact: boolean;
};

type PlayerCount = {
	Date: string;
	Players: number;
	Contacted: number;
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
