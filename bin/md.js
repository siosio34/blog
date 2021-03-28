#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const ejs = require("ejs");

const { promisify } = require("util");

const TAGS = [
  "react",
  "node",
  "flutter",
  "nest",
  "typescript",
  "devops",
  "android",
  "ios",
  "CS",
];

const QUESTIONS = [
  {
    name: "title",
    type: "input",
    message: "제목을 입력해주세요.",
  },
  {
    name: "description",
    type: "input",
    message: "설명을 입력해주세요.",
  },
  {
    name: "tags",
    type: "checkbox",
    message: "태그를 선택해주세요.",
    choices: TAGS,
  },
];

const runCommand = async () => {
  try {
    const answers = await inquirer.prompt(QUESTIONS);

    const { title, description, tags } = answers;

    const date = new Date();
    const author = "youngje jo / siosio3103@gmail.com";

    const writePath = `${__dirname}/../_posts/${title}.md`;

    const template = await promisify(fs.readFile)(
      `${__dirname}/template.md`,
      "utf8"
    );

    const contents = ejs.render(template, {
      title,
      tags,
      description,
      author,
      createdAt: date,
      updatedAt: date,
    });

    fs.writeFileSync(writePath, contents, "utf-8");
  } catch (error) {
    console.log("Error", error);
  }

  // title 을 받는다.
  // 주제목, 부제목, 작가는
  // date: "",
  // 파일이 있는지 확인한다.
  // 파일을 만든다,
  // react, flutter, nodejs, typescript, android, devops
};

return runCommand();
