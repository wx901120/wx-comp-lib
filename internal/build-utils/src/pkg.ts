import findWorkspacePackages from "@pnpm/find-workspace-packages";
import { projRoot } from "./paths";

export const getWorkspacePackages = ()=> findWorkspacePackages(projRoot)
console.log(getWorkspacePackages());
