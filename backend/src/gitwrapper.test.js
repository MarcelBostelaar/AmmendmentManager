import { BareGitFolder, TempGitFolder } from 'gitwrapper.js';

const validGitRepoPath = '/path/to/valid/git/repo';
const newBareGitRepoPath = '/path/to/new/bare/repo';
const workingFolderPath = '/path/to/working/folder';
const hashToClone = 'hash-to-clone';

function checkFilesExist(folderPath, fileList) {
    expect(fileList.every(fileName => fs.existsSync(path.join(folderPath, fileName)))).toBe(true);
}

describe('BareGitFolder', () => {
  let testBareGitFolder;

  beforeAll(() => {
    testBareGitFolder = BareGitFolder.InitializeNew(validGitRepoPath);
  });

  afterAll(() => {
    fs.rmSync(newBareGitRepoPath, {recursive: true})
  })

  test('constructor should throw an error for an invalid bare Git folder', () => {
    expect(() => new BareGitFolder('/nonexistent/folder')).toThrow(Error);
  });

  test('getFolderPath should return the folder location', () => {
    expect(testBareGitFolder.getFolderPath()).toBe(validGitRepoPath);
  });

  test('InitializeNew should create a new bare Git folder', () => {
    const newBareGitFolder = BareGitFolder.InitializeNew(newBareGitRepoPath);
    expect(newBareGitFolder.getFolderPath()).toBe(newBareGitRepoPath);
    checkFilesExist(newBareGitRepoPath, ["config", "description", "HEAD"]);
  });
});

describe('TempGitFolder', () => {
  let testTempGitFolder;

  beforeAll(() => {
    testBareGitFolder = BareGitFolder.InitializeNew(newBareGitRepoPath);
    testTempGitFolder = new TempGitFolder(workingFolderPath, newBareGitRepoPath, hashToClone);
  });

  afterAll(() => {
    fs.rmSync(newBareGitRepoPath, {recursive: true})
    fs.rmSync(workingFolderPath, {recursive: true})
  })

  test('constructor should create a valid TempGitFolder', () => {
    expect(testTempGitFolder.getFolderName()).toBe(workingFolderPath);
    checkFilesExist(path.join(workingFolderPath, ".git"), ["config", "description", "HEAD"]);
  });

  test('getCurrentHash should return the current Git commit hash', () => {
    fs.writeFileSync(path.join(workingFolderPath, "file1.txt"), "content1");
    fs.writeFileSync(path.join(workingFolderPath, "file2.txt"), "content2");
    testTempGitFolder.add('*');
    testTempGitFolder.commit('New commit message');
    const hash = testTempGitFolder.getCurrentHash();
    expect(typeof hash).toBe('string');
  });

  test('commit and push should create a new commit in remote', () => {
    fs.writeFileSync(path.join(workingFolderPath, "file1.txt"), "content1");
    fs.writeFileSync(path.join(workingFolderPath, "file2.txt"), "content2");
    testTempGitFolder.add('*');
    testTempGitFolder.commit('New commit message');
    const result = testTempGitFolder.push();
    expect(result).toContain('Pushed to remote');
  });
});
