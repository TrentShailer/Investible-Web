type LeaderboardRow = {
	id: string;
	name: string;
	portfolio_value: number;
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
	group: string;
	allPlayers: number;
	topPlayers: number;
};
