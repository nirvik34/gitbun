export interface MockCommit {
  label: string;
  diff: string;
  type: string;
  scope: string | null;
}

export const MOCK_COMMITS: MockCommit[] = [
  {
    label: "JWT auth",
    diff: `diff --git a/src/auth.js b/src/auth.js
+  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
+  return { token, expiresAt: Date.now() + 86400000 };`,
    type: "feat",
    scope: "auth",
  },
  {
    label: "DB query fix",
    diff: `diff --git a/api/users.js b/api/users.js
-  const users = db.query('SELECT * FROM users');
+  const users = await db.query('SELECT id, name, email FROM users WHERE active = true');`,
    type: "fix",
    scope: "api",
  },
  {
    label: "README update",
    diff: `diff --git a/README.md b/README.md
+  ## Installation
+  npm install gitbun
+  ## Usage
+  gitbun --ai`,
    type: "docs",
    scope: null,
  },
  {
    label: "Parser feat",
    diff: `diff --git a/src/parser.js b/src/parser.js
+  function parseCommitType(diff) {
+    if (diff.includes('test')) return 'test';
+    if (diff.includes('fix')) return 'fix';
+    return 'feat';
+  }`,
    type: "feat",
    scope: "parser",
  },
];
