import {simpleGit} from "simple-git";
export const mainBranchName = "main";

export function GetGitObject(folder){
    let options = {
        baseDir: folder,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };
    return simpleGit(options);
}