/**
 * SIT725 – 5.4D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "Valid Title",
    author: "Valid Author",
    year: 2020,
    genre: "Other",
    summary: "Valid summary text that satisfies your rules.",
    price: "9.99"
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Title",
    author: "Updated Author",
    year: 2021,
    genre: "Other",
    summary: "Updated summary text.",
    price: "10.50"
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =====================================
  // STUDENTS MUST ADD ADDITIONAL TESTS
  // =====================================
  //
  // Add tests covering:
  // - REQUIRED
  // - TYPE
  // - BOUNDARY
  // - LENGTH
  // - TEMPORAL
  // - UPDATE_FAIL
  //
  // Each test must include appropriate tags.
  //

  // ---- T06 Missing title ----
  await test({
    id: "T06",
    name: "Missing title",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const b = makeValidBook(`b${Date.now()+2}`);
      delete b.title;
      return b;
    })(),
    tags: ["CREATE_FAIL","REQUIRED"]
  });

  // ---- T07 Missing author ----
  await test({
    id: "T07",
    name: "Missing author",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const b = makeValidBook(`b${Date.now()+3}`);
      delete b.author;
      return b;
    })(),
    tags: ["CREATE_FAIL","REQUIRED"]
  });

  // ---- T08 Invalid type year ----
  await test({
    id: "T08",
    name: "Invalid type year",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+4}`), year: "abc" },
    tags: ["CREATE_FAIL","TYPE"]
  });

  // ---- T09 Invalid type price ----
  await test({
    id: "T09",
    name: "Invalid type price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+5}`), price: "abc" },
    tags: ["CREATE_FAIL","TYPE"]
  });

  // ---- T10 Negative price ----
  await test({
    id: "T10",
    name: "Negative price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+6}`), price: "-5" },
    tags: ["CREATE_FAIL","BOUNDARY"]
  });

  // ---- T11 Zero price ----
  await test({
    id: "T11",
    name: "Zero price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+7}`), price: "0" },
    tags: ["CREATE_FAIL","BOUNDARY"]
  });

  // ---- T12 Title too short ----
  await test({
    id: "T12",
    name: "Title too short",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+8}`), title: "A" },
    tags: ["CREATE_FAIL","LENGTH"]
  });

  // ---- T13 Title too long ----
  await test({
    id: "T13",
    name: "Title too long",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+9}`), title: "A".repeat(200) },
    tags: ["CREATE_FAIL","LENGTH"]
  });

  // ---- T14 Future year ----
  await test({
    id: "T14",
    name: "Future year",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+10}`), year: 3000 },
    tags: ["CREATE_FAIL","TEMPORAL"]
  });

  // ---- T15 Invalid update title too short ----
  await test({
    id: "T15",
    name: "Invalid update title too short",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), title: "A" },
    tags: ["UPDATE_FAIL","LENGTH"]
  });

  // ---- T16 Update invalid price ----
  await test({
    id: "T16",
    name: "Update invalid price",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), price: "-10" },
    tags: ["UPDATE_FAIL","BOUNDARY"]
  });

  // ---- T17 Update future year ----
  await test({
    id: "T17",
    name: "Update future year",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: 3000 },
    tags: ["UPDATE_FAIL","TEMPORAL"]
  });

  // ---- T18 Update invalid type year ----
  await test({
    id: "T18",
    name: "Update invalid type year",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: "wrong" },
    tags: ["UPDATE_FAIL","TYPE"]
  });

  // ---- T19 Invalid genre ----
  await test({
    id: "T19",
    name: "Invalid genre",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+11}`), genre: "InvalidGenre" },
    tags: ["CREATE_FAIL","TYPE"]
  });

  // ---- T20 Missing price ----
  await test({
    id: "T20",
    name: "Missing price",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => {
      const b = makeValidBook(`b${Date.now()+12}`);
      delete b.price;
      return b;
    })(),
    tags: ["CREATE_FAIL","REQUIRED"]
  });

  // ---- T21 Update missing summary ----
  await test({
    id: "T21",
    name: "Update missing summary",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: (() => {
      const b = makeValidUpdate();
      delete b.summary;
      return b;
    })(),
    tags: ["UPDATE_FAIL","REQUIRED"]
  });
  // ---- T22 Year too old ----
await test({
  id: "T22",
  name: "Year below minimum boundary",
  method: "POST",
  path: createPath,
  expected: 400,
  body: { ...makeValidBook(`b${Date.now()+13}`), year: 500 },
  tags: ["CREATE_FAIL", "BOUNDARY"]
});
// ---- T23 Missing year ----
await test({
  id: "T23",
  name: "Missing year on create",
  method: "POST",
  path: createPath,
  expected: 400,
  body: (() => {
    const b = makeValidBook(`b${Date.now()+14}`);
    delete b.year;
    return b;
  })(),
  tags: ["CREATE_FAIL", "REQUIRED"]
});

// ---- T24 Missing genre ----
await test({
  id: "T24",
  name: "Missing genre on create",
  method: "POST",
  path: createPath,
  expected: 400,
  body: (() => {
    const b = makeValidBook(`b${Date.now()+15}`);
    delete b.genre;
    return b;
  })(),
  tags: ["CREATE_FAIL", "REQUIRED"]
});

// ---- T25 Missing summary ----
await test({
  id: "T25",
  name: "Missing summary on create",
  method: "POST",
  path: createPath,
  expected: 400,
  body: (() => {
    const b = makeValidBook(`b${Date.now()+16}`);
    delete b.summary;
    return b;
  })(),
  tags: ["CREATE_FAIL", "REQUIRED"]
});

// ---- T26 Author too short ----
await test({
  id: "T26",
  name: "Author too short on create",
  method: "POST",
  path: createPath,
  expected: 400,
  body: { ...makeValidBook(`b${Date.now()+17}`), author: "A" },
  tags: ["CREATE_FAIL", "LENGTH"]
});

// ---- T27 Author too long ----
await test({
  id: "T27",
  name: "Author too long on create",
  method: "POST",
  path: createPath,
  expected: 400,
  body: { ...makeValidBook(`b${Date.now()+18}`), author: "A".repeat(60) },
  tags: ["CREATE_FAIL", "LENGTH"]
});

// ---- T28 Summary too short ----
await test({
  id: "T28",
  name: "Summary too short on create",
  method: "POST",
  path: createPath,
  expected: 400,
  body: { ...makeValidBook(`b${Date.now()+19}`), summary: "Short" },
  tags: ["CREATE_FAIL", "LENGTH"]
});

// ---- T29 Summary too long ----
await test({
  id: "T29",
  name: "Summary too long on create",
  method: "POST",
  path: createPath,
  expected: 400,
  body: { ...makeValidBook(`b${Date.now()+20}`), summary: "A".repeat(600) },
  tags: ["CREATE_FAIL", "LENGTH"]
});

// ---- T30 Invalid genre on update ----
await test({
  id: "T30",
  name: "Invalid genre on update",
  method: "PUT",
  path: updatePath(uniqueId),
  expected: 400,
  body: { ...makeValidUpdate(), genre: "InvalidGenre" },
  tags: ["UPDATE_FAIL", "TYPE"]
});

// ---- T31 Missing title on update ----
await test({
  id: "T31",
  name: "Missing title on update",
  method: "PUT",
  path: updatePath(uniqueId),
  expected: 400,
  body: (() => {
    const b = makeValidUpdate();
    delete b.title;
    return b;
  })(),
  tags: ["UPDATE_FAIL", "REQUIRED"]
});
  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});