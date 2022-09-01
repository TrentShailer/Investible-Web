import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function Handler(
	req: FastifyRequest<{ Params: PUT_analytics_Params; Body: PUT_analytics_Body }>,
	res: FastifyReply,
	fastify: FastifyInstance
) {
	if (req.body.GameSecret !== process.env.GAME_SECRET) {
		return res.send(403);
	}

	// Delete existing (now outdated) data for this session
	try {
		await fastify.pg.query("DELETE FROM analytics WHERE session_id = $1;", [
			req.body.SessionID,
		]);
	} catch (err) {
		return res.send(500);
	}

	try {
		await fastify.pg.query(
			"INSERT INTO analytics(session_id, user_id, game_version, session_end_reason, game_time, portfolio_value, insurance_count, low_risk_count, high_risk_count, clicked_contact) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
			[
				req.body.SessionID,
				req.params.id,
				req.body.gameVersion,
				req.body.SessionEndReason,
				req.body.Time,
				req.body.PortfolioValue,
				req.body.InsuranceCount,
				req.body.LowRiskCount,
				req.body.HighRiskCount,
				req.body.ClickedContact,
			]
		);
	} catch (err) {
		return res.send(500);
	}

	return res.send(200);
}

export default Handler;
