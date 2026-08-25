import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
function b64(str) { return btoa(unescape(encodeURIComponent(str))); }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(() => ({}));
    const repoName = (body.repoName || "pixel-battle").trim();
    const description = body.description || "Pixel Battle — retro 8-bit fighting game";
    const isPrivate = !!body.private;
    const commitMessage = body.commitMessage || "feat: add project files";
    const files = Array.isArray(body.files) ? body.files : [];
    if (files.length === 0) return Response.json({ error: 'No files provided' }, { status: 400 });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("github");
    const headers = { Authorization: "Bearer " + accessToken, Accept: "application/vnd.github+json", "User-Agent": "pixel-battle-uploader" };
    const meResp = await fetch("https://api.github.com/user", { headers });
    if (!meResp.ok) return Response.json({ error: 'Failed to resolve GitHub user' }, { status: 502 });
    const me = await meResp.json();
    const owner = me.login;
    const createResp = await fetch("https://api.github.com/user/repos", { method: "POST", headers, body: JSON.stringify({ name: repoName, description, private: isPrivate, auto_init: true }) });
    let repoExisted = false;
    if (createResp.status === 422) repoExisted = true;
    else if (!createResp.ok) { const t = await createResp.text(); return Response.json({ error: "Repo create failed: " + createResp.status + " " + t.slice(0, 200) }, { status: 502 }); }
    const apiBase = "https://api.github.com/repos/" + owner + "/" + repoName;
    let parentSha = null, baseTreeSha = null;
    for (let attempt = 0; attempt < 4; attempt++) { const refResp = await fetch(apiBase + "/git/refs/heads/main", { headers }); if (refResp.ok) { const ref = await refResp.json(); parentSha = ref.object && ref.object.sha; if (parentSha) { const cResp = await fetch(apiBase + "/git/commits/" + parentSha, { headers }); if (cResp.ok) { const c = await cResp.json(); baseTreeSha = c.tree && c.tree.sha; } } break; } await sleep(800); }
    if (parentSha && baseTreeSha) {
      const treeEntries = [];
      for (const f of files) { const bResp = await fetch(apiBase + "/git/blobs", { method: "POST", headers, body: JSON.stringify({ content: f.content, encoding: "utf-8" }) }); if (!bResp.ok) { const t = await bResp.text(); return Response.json({ error: "Blob failed for " + f.path + ": " + t.slice(0, 160) }, { status: 502 }); } const b = await bResp.json(); treeEntries.push({ path: f.path, mode: "100644", type: "blob", sha: b.sha }); }
      const treeResp = await fetch(apiBase + "/git/trees", { method: "POST", headers, body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }) });
      if (!treeResp.ok) { const t = await treeResp.text(); return Response.json({ error: "Tree failed: " + t.slice(0, 200) }, { status: 502 }); }
      const tree = await treeResp.json();
      const commitResp = await fetch(apiBase + "/git/commits", { method: "POST", headers, body: JSON.stringify({ message: commitMessage, tree: tree.sha, parents: [parentSha] }) });
      if (!commitResp.ok) { const t = await commitResp.text(); return Response.json({ error: "Commit failed: " + t.slice(0, 200) }, { status: 502 }); }
      const commit = await commitResp.json();
      const upd = await fetch(apiBase + "/git/refs/heads/main", { method: "PATCH", headers, body: JSON.stringify({ sha: commit.sha }) });
      if (!upd.ok) { const t = await upd.text(); return Response.json({ error: "Ref update failed: " + t.slice(0, 200) }, { status: 502 }); }
      return Response.json({ ok: true, owner, repo: repoName, repoUrl: "https://github.com/" + owner + "/" + repoName, branch: "main", commitSha: commit.sha, filesPushed: files.length, repoExisted, mode: "git-data" });
    }
    let lastSha = null;
    for (const f of files) {
      const putResp = await fetch(apiBase + "/contents/" + encodeURIComponent(f.path), { method: "PUT", headers, body: JSON.stringify({ message: commitMessage, content: b64(f.content), branch: "main" }) });
      if (!putResp.ok) { const t = await putResp.text(); if (putResp.status === 422) { const exResp = await fetch(apiBase + "/contents/" + encodeURIComponent(f.path) + "?ref=main", { headers }); if (exResp.ok) { const ex = await exResp.json(); const upd2 = await fetch(apiBase + "/contents/" + encodeURIComponent(f.path), { method: "PUT", headers, body: JSON.stringify({ message: commitMessage, content: b64(f.content), branch: "main", sha: ex.sha }) }); if (upd2.ok) { const d = await upd2.json(); lastSha = d.commit && d.commit.sha; continue; } } } return Response.json({ error: "Contents put failed for " + f.path + ": " + t.slice(0, 160) }, { status: 502 }); }
      const d = await putResp.json(); lastSha = d.commit && d.commit.sha;
    }
    return Response.json({ ok: true, owner, repo: repoName, repoUrl: "https://github.com/" + owner + "/" + repoName, branch: "main", commitSha: lastSha, filesPushed: files.length, repoExisted, mode: "contents" });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}
