// components/CodeSnippets.js
"use client";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const snippets = [
  {
    language: "hcl",
    code: `resource "aws_instance" "gov_app" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
  tags = {
    Name        = "CentricGovApp"
    Environment = "Production"
  }
}`,
  },
  {
    language: "javascript",
    code: `// JavaScript

import express from "express";
const app = express();

app.get("/api/public-data", (req, res) => {
  res.json({ status: "secure", agency: "Centric IT Solution" });
});

app.listen(8080, () =>
  console.log("Public Sector API running on port 8080")
);`,
  },
  {
    language: "python",
    code: `# Python
    
import os, hashlib

def audit_file(path):
    with open(path, "rb") as f:
        checksum = hashlib.sha256(f.read()).hexdigest()
    print(f"{path}: {checksum}")

for file in os.listdir("/secure/files"):
    audit_file(f"/secure/files/{file}")`,
  },
  {
    language: "yaml",
    code: `name: CI Pipeline

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm install
      - name: Run Security Tests
        run: npm run audit`,
  },
];

export default function CodeSnippets() {
  const [index, setIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const code = snippets[index].code;
    if (charIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode((prev) => prev + code[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      // After full snippet typed, wait then reset
      const resetTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % snippets.length);
        setDisplayedCode("");
        setCharIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimeout);
    }
  }, [charIndex, index]);

  return (
    <div data-aos="fade-in" className="bg-[#1e1e2e] rounded-xl shadow-lg overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2a2a3c]">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
      </div>

      {/* Code with typewriter + syntax highlight */}
      <div className="p-6 text-sm font-mono text-gray-200 overflow-auto">
        <SyntaxHighlighter
      language={snippets[index].language}
      style={atomOneDark}
      customStyle={{
        borderRadius: "12px",
        padding: "20px",
        fontSize: "0.9rem",
        minHeight: "220px",
        textAlign: "left",
        whiteSpace: "pre-wrap",
        
      }}
      wrapLines={true}
      showLineNumbers={true}
    >
      {displayedCode + (charIndex < snippets[index].code.length ? "|" : "")}
    </SyntaxHighlighter>
        <span className="cursor"></span>
      </div>
    </div>
  );
}
