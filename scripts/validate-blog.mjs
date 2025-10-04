import fs from "fs";
import path from "path";
import matter from "gray-matter";
import chalk from "chalk";

const postsDirectory = path.join(process.cwd(), "content/blog");
const strictMode = process.argv.includes("--strict");
let errors = 0;

function logError(message) {
  console.error(chalk.red("ERROR: " + message));
  errors++;
}

function logWarning(message) {
  console.warn(chalk.yellow("WARN: " + message));
}

function validatePost(slug) {
  const fullPath = path.join(postsDirectory, slug, "index.mdx");
  if (!fs.existsSync(fullPath)) {
    logWarning(`Skipping directory without index.mdx: ${slug}`);
    return;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data } = matter(fileContents);
  const requiredFields = ["title", "description", "date", "lang", "draft"];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      logError(`Missing required front-matter field "${field}" in ${slug}`);
    }
  }

  if (data.date && isNaN(new Date(data.date).getTime())) {
    logError(`Invalid date format for "date" in ${slug}. Please use YYYY-MM-DD.`);
  }

  if (data.updated && isNaN(new Date(data.updated).getTime())) {
    logError(`Invalid date format for "updated" in ${slug}. Please use YYYY-MM-DD.`);
  }

  if (data.cover && !fs.existsSync(path.join(postsDirectory, slug, data.cover))) {
    logError(`Cover image path not found for "${data.cover}" in ${slug}`);
  }
}

console.log(chalk.blue("Validating blog content..."));
const slugs = fs.readdirSync(postsDirectory);
const slugSet = new Set();

for (const slug of slugs) {
  if (slugSet.has(slug)) {
    logError(`Duplicate slug found: ${slug}`);
  }
  slugSet.add(slug);
  validatePost(slug);
}

if (errors > 0) {
  console.error(chalk.red(`\nValidation failed with ${errors} error(s).`));
  if (strictMode) {
    process.exit(1);
  }
} else {
  console.log(chalk.green("\nValidation successful!"));
}