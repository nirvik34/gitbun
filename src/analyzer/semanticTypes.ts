/**
 * Semantic event types detected from AST comparison
 */
export type SemanticEventType =
  | 'function_rename'
  | 'api_signature_change'
  | 'logic_extraction'
  | 'logic_movement'
  | 'interface_change';

export interface SemanticEvent {
  type: SemanticEventType;
  file: string;               // affected file path
  entityName?: string;        // e.g., function name, interface name
  details: Record<string, unknown>;
}

export interface SemanticAnalysisResult {
  events: SemanticEvent[];
  durationMs: number;
  skipped: boolean;           // true if analysis timed out or failed
}