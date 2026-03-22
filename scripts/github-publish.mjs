import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const projectDir = resolve(process.cwd());
loadDotEnv(join(projectDir, ".env"));
const owner = requireEnv("GITHUB_OWNER");
const token = requireEnv("GITHUB_TOKEN");
const repo = process.env.GITHUB_REPO || basename(projectDir);
const isPrivate = (process.env.GITHUB_PRIVATE || "true").toLowerCase() !== "false";
const defaultBranch = "main";
const remoteName = "origin";

async function main() {
  assertGitInstalled();

  const remoteUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
  const repoInfo = await ensureGithubRepo({ owner, repo, token, isPrivate });

  initGitRepo(projectDir);
  ensureMainBranch(projectDir, defaultBranch);
  configureRemote(projectDir, remoteName, remoteUrl);
  try {
    createCommitIfNeeded(projectDir);
    push(projectDir, remoteName, defaultBranch);
  } finally {
    scrubTokenFromConfig(projectDir);
  }

  console.log(`Repo ready: ${repoInfo.html_url}`);
}

async function ensureGithubRepo({ owner, repo, token, isPrivate }) {
  const existing = await githubRequest(`/repos/${owner}/${repo}`, {
    token,
    method: "GET",
    allow404: true,
  });

  if (existing.status === 200) {
    return existing.body;
  }

  const created = await githubRequest("/user/repos", {
    token,
    method: "POST",
    body: {
      name: repo,
      private: isPrivate,
      auto_init: false,
    },
  });

  return created.body;
}

async function githubRequest(path, { token, method, body, allow404 = false }) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "codex-github-publisher",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (allow404 && response.status === 404) {
    return { status: 404, body: null };
  }

  if (!response.ok) {
    const message = await safeJson(response);
    throw new Error(`GitHub API ${response.status}: ${JSON.stringify(message)}`);
  }

  return { status: response.status, body: await safeJson(response) };
}

async function safeJson(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

function initGitRepo(dir) {
  if (!existsSync(join(dir, ".git"))) {
    runGit(dir, ["init"]);
  }
}

function ensureMainBranch(dir, branch) {
  runGit(dir, ["checkout", "-B", branch]);
}

function configureRemote(dir, name, url) {
  const hasRemote = runGit(dir, ["remote"], { allowFailure: true })
    .split("\n")
    .map((item) => item.trim())
    .includes(name);

  if (hasRemote) {
    runGit(dir, ["remote", "set-url", name, url]);
    return;
  }

  runGit(dir, ["remote", "add", name, url]);
}

function createCommitIfNeeded(dir) {
  runGit(dir, ["add", "."]);

  const status = runGit(dir, ["status", "--porcelain"], { allowFailure: true }).trim();
  if (!status) {
    return;
  }

  ensureGitIdentity(dir);
  runGit(dir, ["commit", "-m", "Initial publish"]);
}

function ensureGitIdentity(dir) {
  const name = runGit(dir, ["config", "--get", "user.name"], { allowFailure: true }).trim();
  const email = runGit(dir, ["config", "--get", "user.email"], { allowFailure: true }).trim();

  if (!name) {
    runGit(dir, ["config", "user.name", "Codex Publisher"]);
  }
  if (!email) {
    runGit(dir, ["config", "user.email", "codex-publisher@example.com"]);
  }
}

function push(dir, remote, branch) {
  runGit(dir, ["push", "-u", remote, branch]);
}

function scrubTokenFromConfig(dir) {
  const configPath = join(dir, ".git", "config");
  if (!existsSync(configPath)) {
    return;
  }

  const cleanUrl = `https://github.com/${owner}/${repo}.git`;
  runGit(dir, ["remote", "set-url", remoteName, cleanUrl], { allowFailure: true });
}

function runGit(dir, args, options = {}) {
  try {
    return execFileSync("git", args, {
      cwd: dir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    if (options.allowFailure) {
      return error.stdout ? String(error.stdout) : "";
    }
    const stderr = error.stderr ? String(error.stderr).trim() : error.message;
    throw new Error(`git ${args.join(" ")} failed: ${stderr}`);
  }
}

function assertGitInstalled() {
  runGit(projectDir, ["--version"]);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const source = readFileSync(filePath, "utf8");
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

main().catch((error) => {
  const gitDir = join(projectDir, ".git");
  const shouldCleanup = existsSync(gitDir) && readdirSync(gitDir).length === 0;
  if (shouldCleanup) {
    rmSync(gitDir, { recursive: true, force: true });
  }
  console.error(error.message);
  process.exitCode = 1;
});
