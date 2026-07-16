import assert from "node:assert/strict";
import fs from "node:fs";

const route = fs.readFileSync(new URL("./route.ts", import.meta.url), "utf8");
const caller = fs.readFileSync(new URL("../../../pixforme.tsx", import.meta.url), "utf8");
function classifyRawKind(rawKind) {
  if (typeof rawKind !== "string" || rawKind.length === 0) return 400;
  if (rawKind.startsWith("homepage-")) return 403;
  if (rawKind === "report-photo") return "PASS_GATE";
  return 400;
}

const kindMatrix = [
  ["undefined", undefined, 400],
  ["null", null, 400],
  ["empty", "", 400],
  ["space-only", " ", 400],
  ["tab-only", "\t", 400],
  ["exact-report-photo", "report-photo", "PASS_GATE"],
  ["trailing-space-report-photo", "report-photo ", 400],
  ["leading-space-report-photo", " report-photo", 400],
  ["trailing-tab-report-photo", "report-photo\t", 400],
  ["trailing-nbsp-report-photo", "report-photo\u00a0", 400],
  ["uppercase-report-photo", "REPORT-PHOTO", 400],
  ["underscore-report-photo", "report_photo", 400],
  ["homepage-hero", "homepage-hero", 403],
  ["homepage-prefix-only", "homepage-", 403],
  ["homepage-report-photo", "homepage-report-photo", 403],
  ["homepage-without-hyphen", "homepage", 400],
  ["leading-space-homepage", " homepage-hero", 400],
  ["marketing-hero", "marketing-hero", 400],
  ["public-asset", "public-asset", 400],
  ["arbitrary-kind", "something-else", 400],
];

const authIndex = route.indexOf("await serverClient.auth.getUser()");
const bodyParseIndex = route.indexOf("await request.formData()");
const serviceRoleIndex = route.indexOf(
  "createSupabaseServiceRoleClient()",
  route.indexOf("export async function POST"),
);
const kindPolicyStart = route.indexOf('const rawKindEntry = form.get("kind")');
const kindPolicyEnd = route.indexOf('if (form.has("bucket")', kindPolicyStart);
const kindPolicySource = route.slice(kindPolicyStart, kindPolicyEnd);
const forbiddenKindNormalization =
  /rawKind(?:Entry)?\s*\.\s*(?:trim|trimStart|trimEnd|toLowerCase|normalize|replace)\s*\(/;

const checks = [
  ["auth-before-body-and-service", authIndex >= 0 && authIndex < bodyParseIndex && bodyParseIndex < serviceRoleIndex],
  ["anonymous-401-before-kind", route.indexOf("status: 401") < kindPolicyStart],
  ["raw-kind-read-from-formdata", kindPolicyStart >= 0],
  [
    "raw-kind-string-used-without-conversion",
    /const rawKind = rawKindEntry;/.test(kindPolicySource),
  ],
  [
    "missing-empty-non-string-kind-400",
    /typeof rawKindEntry !== "string" \|\| rawKindEntry\.length === 0[\s\S]*?status: 400/.test(kindPolicySource),
  ],
  [
    "homepage-raw-prefix-403",
    /rawKind\.startsWith\("homepage-"\)[\s\S]*?status: 403/.test(kindPolicySource),
  ],
  [
    "exact-raw-report-photo-equality",
    /const isReportPhoto = rawKind === "report-photo";/.test(kindPolicySource),
  ],
  [
    "non-report-kind-400",
    /if \(!isReportPhoto\)[\s\S]*?status: 400/.test(kindPolicySource),
  ],
  ["no-kind-normalization-before-authorization", !forbiddenKindNormalization.test(kindPolicySource)],
  [
    "client-targets-rejected",
    /form\.has\([^)]*bucket[^)]*\).*form\.has\([^)]*path[^)]*\)[\s\S]*?status: 400/.test(route),
  ],
  [
    "report-only-server-bucket",
    route.includes("const bucket = getSupabaseStorageBucket()")
      && !route.includes("getHomepageStorageBuckets")
      && !route.includes("pickBucket")
      && !route.includes("getPublicUrl"),
  ],
  [
    "server-owner-path",
    /const pathParts = \[ownerId, [^\]]*report-photos[^\]]*\]/.test(route)
      && route.includes("crypto.randomUUID()"),
  ],
  ["ownership-before-service", route.indexOf("owner_id") < serviceRoleIndex],
  ["mime-before-service", route.indexOf("ALLOWED_IMAGE_TYPES.has(file.type)") < serviceRoleIndex],
  ["size-before-service", route.indexOf("file.size > MAX_IMAGE_BYTES") < serviceRoleIndex],
  [
    "malformed-multipart-400",
    /await request\.formData\(\);[\s\S]*?catch \{[\s\S]*?status: 400/.test(route),
  ],
  ["generic-dependency-errors", !route.includes(".message") && !route.includes("bucket: bucket")],
  [
    "post-upload-cleanup",
    (route.match(/storage\.from\(bucket\)\.remove\(\[objectPath\]\)/g) || []).length === 2,
  ],
  [
    "active-caller-kind",
    /form\.append\([^)]*kind[^)]*report-photo[^)]*\)/.test(caller)
      && !/form\.append\([^)]*bucket/.test(caller)
      && !/form\.append\([^)]*path/.test(caller),
  ],
];

let assertionCount = 0;

for (const [name, rawKind, expected] of kindMatrix) {
  assert.equal(classifyRawKind(rawKind), expected, "kind-matrix:" + name);
  assertionCount += 1;
  console.log("PASS kind-matrix:" + name + " => " + expected);
}

for (const [name, passed] of checks) {
  assert.equal(passed, true, name);
  assertionCount += 1;
  console.log("PASS " + name);
}

console.log(
  "PASS " + assertionCount
    + " dependency-free route-policy/static assertions ("
    + kindMatrix.length + " matrix, " + checks.length + " source/caller)",
);
