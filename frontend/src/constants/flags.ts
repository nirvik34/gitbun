export interface Flag {
  flag: string;
  desc: string;
  default: string;
}

export const FLAGS: Flag[] = [
  { flag: "--ai",          desc: "Use AI-powered commit message generation",      default: "enabled"  },
  { flag: "--no-ai",       desc: "Disable AI mode, use rule-based summarization", default: "disabled" },
  { flag: "--interactive", desc: "Launch interactive mode for message editing",   default: "—"        },
  { flag: "--config",      desc: "Specify a custom config file path",             default: "—"        },
  { flag: "--help",        desc: "Show help and usage information",               default: "—"        },
];
