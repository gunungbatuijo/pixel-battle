import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
const COMBAT_KEYWORDS = ["combat", "fight", "attack", "combo", "stamina", "execute", "blood", "dash", "block", "hit", "hitbox", "ko", "ragdoll", "skill", "ai", "bot", "balance", "damage", "projectile", "grab", "launcher", "round", "health"];
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    const owner = (body.owner || "").trim();
    const repo = (body.repo || "").trim();
    const branch = (body.branch || "main").trim();
    const path = (body.path || "src/game").trim();
    if (!owner || !repo) return Response.json({ error: 'owner and repo are required' }, { status: 400 });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("github");
    const params = new URLSearchParams({ sha: branch, per_page: "100" });
    if (path) params.set("path", path);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?${params.toString()}`;
    const resp = await fetch(apiUrl, { headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github+json", "User-Agent": "pixel-battle-commit-tracker" } });
    if (resp.status === 404) return Response.json({ error: 'Repository or branch not found.' }, { status: 404 });
    if (!resp.ok) { const txt = await resp.text(); return Response.json({ error: `GitHub API error: ${resp.status} ${txt.slice(0, 200)}` }, { status: 502 }); }
    const commits = await resp.json();
    const mapped = (commits || []).map((c: any) => ({ sha: c.sha, message: (c.commit && c.commit.message) || "", author: (c.commit && c.commit.author && c.commit.author.name) || (c.author && c.author.login) || "unknown", date: (c.commit && c.commit.author && c.commit.author.date) || null, url: c.html_url }));
    const isCombat = (msg: string) => COMBAT_KEYWORDS.some((kw) => msg.toLowerCase().includes(kw));
    const filtered = mapped.filter((c: any) => isCombat(c.message));
    return Response.json({ total: mapped.length, combat: filtered.length, commits: mapped, combatCommits: filtered, owner, repo, branch, path });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}
