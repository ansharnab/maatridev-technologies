# Contributing to MaatriDev Technologies

This repository is **public**, which means anyone can **view and clone** it. On GitHub, **push access is not granted to the public** — only the owner and invited collaborators can push directly.

## How to contribute changes

### Option A — Pull request (recommended for everyone)

1. **Fork** the repo on GitHub: use **Fork** on [github.com/ansharnab/maatridev-technologies](https://github.com/ansharnab/maatridev-technologies).
2. Clone **your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/maatridev-technologies.git
   cd maatridev-technologies
   ```
3. Create a branch, commit, and push to **your fork**:
   ```bash
   git checkout -b my-feature
   git add -A
   git commit -m "Describe your change"
   git push -u origin my-feature
   ```
4. Open a **Pull Request** from your fork into `ansharnab/maatridev-technologies` → `main`.

### Option B — Direct push (collaborators only)

The repo owner must add you as a collaborator:

1. Owner: GitHub repo → **Settings** → **Collaborators** → **Add people** → choose role **Write** or **Maintain**.
2. Accept the invitation email from GitHub.
3. Clone with HTTPS or SSH using **your** GitHub account:
   ```bash
   git clone https://github.com/ansharnab/maatridev-technologies.git
   git push origin main
   ```

## Common errors

| Message | Cause | Fix |
|--------|--------|-----|
| `Permission denied` / `403` | Not a collaborator | Use fork + PR, or ask owner to add you |
| `Authentication failed` | Wrong account or token | `gh auth login` or update credentials |
| `protected branch` / `required reviews` | Branch protection on `main` | Push a feature branch and open a PR |

## For repository owners

- **Public** = read for everyone; **write** only for collaborators.
- To let a team push directly: **Settings → Collaborators and teams**.
- To require review before merge: **Settings → Branches → Branch protection rules** (contributors can still push feature branches if allowed).
