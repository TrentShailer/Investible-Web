import Filter from "bad-words";
const filter = new Filter();

function ValidateName(name: string): ValidName {
	if (name === undefined || name === null || name === "" || name.length < 1) {
		return { valid: false, reason: "You must enter a name." };
	}

	if (name.length > 12) {
		return { valid: false, reason: "Name is too long (max 12)." };
	}

	if (filter.isProfane(name)) {
		return { valid: false, reason: "Name contains profanity." };
	}

	if (name.match("[^a-zA-Z0-9_]")) {
		return { valid: false, reason: "Name my only contain underscores, letters, and numbers." };
	}

	return { valid: true };
}

export default ValidateName;
