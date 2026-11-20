import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "out");
const worktreeDir = path.resolve(projectRoot, "..", ".gh-pages-deploy");

function run(command, cwd = projectRoot) {
  console.log(`\n▶ ${command}`);
  execSync(command, { cwd, stdio: "inherit" });
}

function cleanWorktree() {
  if (fs.existsSync(worktreeDir)) {
    try {
      execSync(`git worktree remove --force "${worktreeDir}"`, {
        cwd: projectRoot,
        stdio: "ignore",
      });
    } catch {
      // worktree 등록이 없는 경우 무시
    }
    if (fs.existsSync(worktreeDir)) {
      fs.rmSync(worktreeDir, { recursive: true, force: true });
    }
  }
}

try {
  console.log("🚀 MyLink 정적 빌드 및 GitHub Pages(gh-pages) 자동 배포를 시작합니다...");

  // 1. 타입 체크 및 정적 빌드 (.env.local 자동 포함)
  run("npx tsc --noEmit");
  run("npm run build");

  if (!fs.existsSync(outDir)) {
    throw new Error("out/ 디렉토리가 생성되지 않았습니다. next.config.ts의 output: 'export' 설정을 확인하세요.");
  }

  // 2. 기존 임시 worktree 정리 후 gh-pages 준비
  cleanWorktree();
  run("git fetch origin gh-pages");
  run(`git worktree add -B gh-pages "${worktreeDir}" origin/gh-pages`);

  // 3. worktree 내부 기존 파일 정리 (.git 제외)
  for (const entry of fs.readdirSync(worktreeDir)) {
    if (entry === ".git") continue;
    fs.rmSync(path.join(worktreeDir, entry), { recursive: true, force: true });
  }

  // 4. out/ 결과물 복사 및 .nojekyll 생성
  fs.cpSync(outDir, worktreeDir, { recursive: true });
  fs.writeFileSync(path.join(worktreeDir, ".nojekyll"), "");

  // 5. 변경사항 확인 후 커밋 & 푸시
  const status = execSync("git status --porcelain", {
    cwd: worktreeDir,
    encoding: "utf8",
  }).trim();

  if (!status) {
    console.log("\n✅ 배포할 변경사항이 없습니다. 이미 최신 상태입니다.");
  } else {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    run("git add -A", worktreeDir);
    run(`git commit -m "deploy: 최신 빌드 자동 배포 (${timestamp})"`, worktreeDir);
    run("git push origin gh-pages", worktreeDir);
    console.log("\n🎉 GitHub Pages 배포 완료!");
    console.log("🌐 https://elixkim404.github.io/mylink");
  }
} finally {
  cleanWorktree();
}
