interface POST_leaderboard_Body {
	name: string;
	portfolio_value: number;
	secret: string;
}

interface GET_validname_Params {
	name: string;
}

interface PUT_analytics_Params {
	id: string;
}

interface PUT_analytics_Body {
	GameSecret: string;
	SessionID: string;
	gameVersion: string;
	Time: number;
	PortfolioValue: number;
	InsuranceCount: number;
	LowRiskCount: number;
	HighRiskCount: number;
	SessionEndReason: number;
	ClickedContact: boolean;
}

enum SessionEndReason {
	GameOverStability,
	GameOverPoor,
	MainMenu,
	none,
}

type ValidName = {
	valid: boolean;
	reason?: string | undefined;
};
