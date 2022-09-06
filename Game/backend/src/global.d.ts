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
