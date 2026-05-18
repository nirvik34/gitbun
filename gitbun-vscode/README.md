# Gitbun for VSCode
AI-powered commit message generation inside VSCode.
## Requirements
- Node.js installed
- Gitbun CLI: `npm install -g gitbun`
## Usage
1. Stage your changes in Source Control
2. Press `Ctrl+Shift+G G` (Mac: `Cmd+Shift+G G`) or run `Gitbun: Generate Commit Message` from the Command Palette
3. The generated message appears in the Source Control input box
4. Review, edit if needed, then click Commit
## Configuration
Place a `.smartcommitrc` file in your repo root. Gitbun picks it up automatically.
## Troubleshooting
Open the Output panel and select "Gitbun" channel for debug logs.
