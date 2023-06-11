import type { WorkspaceView } from "../G/CompoundView/Workspace/WorkspaceView";
declare global {
  interface Window {
    workspace: WorkspaceView;
  }
}