export type TerminalLineType = "cmd" | "info" | "result" | "sub" | "success" | "spacer";

export interface TerminalLine {
  delay: number;
  text: string;
  type: TerminalLineType;
}

export const TERMINAL_LINES: TerminalLine[] = [
  { delay: 0,    text: "$ git add src/analyzer.js",                                       type: "cmd"     },
  { delay: 600,  text: "$ gitbun --ai",                                                   type: "cmd"     },
  { delay: 1200, text: "✦ Analyzing staged changes...",                                   type: "info"    },
  { delay: 2000, text: "✦ Detecting change scope: analyzer",                              type: "info"    },
  { delay: 2700, text: "✦ Classifying type: feat",                                        type: "info"    },
  { delay: 3400, text: "✦ Generating commit message...",                                   type: "info"    },
  { delay: 4200, text: "",                                                                 type: "spacer"  },
  { delay: 4400, text: "[AI] feat(analyzer): add type classification for commit context", type: "result"  },
  { delay: 4600, text: "  - Implemented typeClassifier to detect code change types",      type: "sub"     },
  { delay: 4800, text: "  - Enhanced commit message quality with better context",         type: "sub"     },
  { delay: 5200, text: "",                                                                 type: "spacer"  },
  { delay: 5400, text: "✓ Committed successfully",                                        type: "success" },
];
