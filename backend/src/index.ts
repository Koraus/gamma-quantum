import { Router } from "itty-router";
import { json, error, withContent, status } from "itty-router-extras";
import { assertSolved, solutionStats } from "../../src/puzzle/world";
import { ProblemDecoder, keyifyProblem } from "../../src/puzzle/terms/Problem";
import { StatsStorage } from "./StatsStorage";
import { Env } from "./Env";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { SolutionDecoder, keyifySolution } from "../../src/puzzle/terms/Solution";
import { _throw } from "../../src/utils/_throw";
import { assert as assertDecoded } from "../../src/utils/DecoderEx";
import { clientifyRoutedStub } from "./RoutedDurableObject";


function getStatsStorageStub(
    name: string,
    env: Env,
) {
    const id = env.STATS_STORAGE.idFromName(name);
    const stub = env.STATS_STORAGE.get(id);
    return clientifyRoutedStub<StatsStorage>(stub);
}

const router = Router()
    .options("*", () => status(204))
    .get("/", async (req, env: Env) => {
        const problemKey = new URL(req.url).searchParams.get("problem") 
            ?? _throw("problem not set");
        const problem = JSON.parse(problemKey);
        assertDecoded(ProblemDecoder, problem);
        // todo what could go wrong if we just use problemKey as id here?
        // + this would allow getting stats form prev puzzleIds
        // + performance
        // ? would give read access 
        //       to any obj in STATS_STORAGE DurableObjectNamespace
        // ? the problemKey would need to be striclty well formed
        //       (but now it almost needs too)
        const statsStorage = getStatsStorageStub(
            keyifyProblem(problem), env);
        return json(await statsStorage.getData());
    })
    .post("/", withContent, async (req, env: Env) => {
        const solution = (req as { content: unknown } & Request).content;
        assertDecoded(SolutionDecoder, solution);
        assertSolved(solution);
        const statsStorage = getStatsStorageStub(
            keyifyProblem(solution.problem), env);
        return json(await statsStorage.add(
            SHA256(keyifySolution(solution)).toString(Hex),
            solutionStats(solution)));
    });


export { StatsStorage } from "./StatsStorage";
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
