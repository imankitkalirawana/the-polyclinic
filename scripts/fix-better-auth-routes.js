const fs = require('fs');
const path = require('path');

// Pattern to replace auth wrapper with direct session retrieval
const fixRoute = (content) => {
  // Replace auth wrapper with direct session retrieval
  content = content.replace(
    /export const (GET|POST|PUT|DELETE|PATCH) = auth\(async \(req: BetterAuthRequest\) => \{/g,
    "export const $1 = async (req: Request) => {\n  const session = await auth.api.getSession({\n    headers: req.headers,\n  });\n  \n  if (!session?.user) {\n    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });\n  }"
  );

  // Replace req.auth.user with session.user
  content = content.replace(/req\.auth\.user/g, 'session.user');

  return content;
};

// Find all API route files
const apiDir = path.join(__dirname, '../app/api');
const routeFiles = [];

function findRouteFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findRouteFiles(filePath);
    } else if (file === 'route.ts') {
      routeFiles.push(filePath);
    }
  });
}

findRouteFiles(apiDir);

// Process each file
routeFiles.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Only process files that have auth wrapper
  if (content.includes('auth(async (req: BetterAuthRequest)')) {
    console.log(`Processing: ${filePath}`);
    content = fixRoute(content);
    fs.writeFileSync(filePath, content);
  }
});

console.log('Better Auth route fixes completed!');
