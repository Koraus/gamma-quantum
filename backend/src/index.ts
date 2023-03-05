import { Router } from "itty-router";
import { json, error, withContent, status } from "itty-router-extras";
import { isSolved } from "../../src/puzzle/actions";
import { evaluate } from "../../src/puzzle/evaluate";
import { ProblemDecoder, getProblemCmp } from "../../src/puzzle/problem";
import { clientifyStatsStub } from "./Stats";
import { Env } from "./Env";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { SolutionDecoder, keyifySolution } from "../../src/puzzle/solution";
import { _throw } from "../../src/utils/_throw";
import { assertDecoded } from "../../src/utils/DecoderEx";
export { Stats } from "./Stats";


export function getStatsStub(
    name: string,
    env: Env,
) {
    const id = env.STATS.idFromName(name);
    const stub = env.STATS.get(id);
    return clientifyStatsStub(stub);
}

const router = Router()
    .options("*", () => status(204))
    .get("/", async (req, env: Env) => {
        const q = new URL(req.url).searchParams;
        const problemKey = q.get("problem") ?? _throw("problem not set");
        const problem = JSON.parse(problemKey);
        assertDecoded(ProblemDecoder, problem);
        const stats = getStatsStub(getProblemCmp(problem), env);
        return json(await stats.getData());
    })
    .post("/", withContent, async (req, env: Env) => {
        const solution = (req as { content: unknown } & Request).content;
        assertDecoded(SolutionDecoder, solution);
        const finalState = evaluate(solution);
        isSolved(finalState.state)
            || _throw("the solution in not complete");

        const stubStats = getStatsStub(getProblemCmp(solution.problem), env);
        return json(await stubStats.add(
            SHA256(keyifySolution(solution)).toString(Hex),
            finalState.state.stats));
    });


export default {
    fetch: (request: Request, env: Env) =>
        router
            .handle(request, env)
            .then((response: Response) => {
                const corsHeaders = {
                    "Access-Control-Allow-Origin": 
                        "*",
                    "Access-Control-Allow-Methods": 
                        "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": 
                        "authorization, referer, origin, content-type",
                    "Access-Control-Max-Age": 
                        "3600",
                };
                for (const [k, v] of Object.entries(corsHeaders)) {
                    response.headers.set(k, v);
                }
                return response;
            })
            .catch(err => {
                console.error(err);
                return error(500, err instanceof Error ? err.stack : err);
            }),
};
