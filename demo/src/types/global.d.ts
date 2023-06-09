import type { WorkspaceView } from "../G/CompoundView/WorkspaceView";
declare global {
  interface Window {
    workspace: WorkspaceView;
  }
}