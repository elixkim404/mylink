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
  if (!fs.existsSync(worktreeDir)) return;
  try {
    execSync(`git worktree remove --force "${worktreeDir}"`, {
      cwd: projectRoot,
      stdio: "ignore",
    });
  } catch {
    // worktree 등록이 없는 경우 무시
  }
  if (fs.existsSync(worktreeDir)) {
    try {
      fs.rmSync(worktreeDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
    } catch {
      console.warn(`\n⚠️ 임시 폴더를 삭제하지 못했습니다(배포에는 영향 없음): ${worktreeDir}`);
    }
  }
  try {
    execSync("git worktree prune", { cwd: projectRoot, stdio: "ignore" });
  } catch {
    // 무시
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

  // 1-1. Next.js static export에서 누락된 opengraph-image 파일을 out/으로 복사 및 메타 태그 보완
  const nextBuildDir = path.join(projectRoot, ".next-build");
  const baseUrl = "https://elixkim404.github.io/mylink";
  const ogRoutes = ["", "edit", "login", "stats", "me"];

  for (const route of ogRoutes) {
    const srcOgPath = route
      ? path.join(nextBuildDir, route, "opengraph-image")
      : path.join(nextBuildDir, "opengraph-image");

    if (!fs.existsSync(srcOgPath)) continue;

    const targetDir = route ? path.join(outDir, route) : outDir;
    fs.mkdirSync(targetDir, { recursive: true });

    const destPngPath = path.join(targetDir, "opengraph-image.png");
    fs.copyFileSync(srcOgPath, destPngPath);

    const htmlPath = path.join(targetDir, "index.html");
    if (fs.existsSync(htmlPath)) {
      let html = fs.readFileSync(htmlPath, "utf8");
      if (!html.includes('property="og:image"')) {
        const ogUrl = route ? `${baseUrl}/${route}/opengraph-image.png` : `${baseUrl}/opengraph-image.png`;
        const ogTags =
          `<meta property="og:image" content="${ogUrl}"/>` +
          `<meta property="og:image:width" content="1200"/>` +
          `<meta property="og:image:height" content="630"/>` +
          `<meta name="twitter:card" content="summary_large_image"/>` +
          `<meta name="twitter:image" content="${ogUrl}"/>`;
        html = html.replace("</head>", `${ogTags}</head>`);
        fs.writeFileSync(htmlPath, html, "utf8");
      }
    }
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

  // 5. 변경사항 스테이징 후, 실제 staged 변경이 있을 때만 커밋 & 푸시
  run("git add -A", worktreeDir);
  const staged = execSync("git diff --cached --name-only", {
    cwd: worktreeDir,
    encoding: "utf8",
  }).trim();

  if (!staged) {
    console.log("\n✅ 배포할 변경사항이 없습니다. 이미 최신 상태입니다.");
  } else {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    run(`git commit -m "deploy: 최신 빌드 자동 배포 (${timestamp})"`, worktreeDir);
    run("git push origin gh-pages", worktreeDir);
    console.log("\n🎉 GitHub Pages 배포 완료!");
    console.log("🌐 https://elixkim404.github.io/mylink");
  }
} finally {
  cleanWorktree();
}
