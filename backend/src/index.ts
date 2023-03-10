import "@rauschma/iterator-helpers-polyfill/install";
import { Router } from "itty-router";
import { json, error, withContent, status } from "itty-router-extras";
import { assertSolved, solutionStats } from "../../src/puzzle/world";
import { keyifyProblem } from "../../src/puzzle/terms/Problem";
import { StatsStorage } from "./StatsStorage";
import { Env } from "./Env";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { keyProjectSolution, keyifySolution } from "../../src/puzzle/terms/Solution";
import { _throw } from "../../src/utils/_throw";
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
        const { content } = (req as { content: unknown } & Request);
        const solution = keyProjectSolution(content);
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
