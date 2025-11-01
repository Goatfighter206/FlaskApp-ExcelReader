# Master Prompt Patterns and Templates

This document collects high-value "master" prompt patterns and ready-to-use templates you can adapt for many tasks. Use these as starting points; refine with domain context and examples (few-shot) for best results.

---

## 1. System / Persona Prompt
Purpose: Set role, expertise, tone, and constraints.

Template:

You are an expert [role], with [years/area] experience. Be concise and practical. When answering, follow these rules:
- Prefer exact, runnable examples when providing code.
- Ask clarifying questions if the user's request is ambiguous.
- If you are not sure, say "I don't know" and list what you'd need to find out.

Example:

You are an expert Python developer (10+ years). Provide concise, tested code examples in Python 3.11. If a question lacks details, ask one clarifying question before writing code.


## 2. Zero-shot Instruction
Purpose: Quick single-shot instruction for straightforward tasks.

Template:

"Summarize the following text in 3 bullet points and a one-sentence TL;DR: [TEXT]"

Use when tasks are simple and you want the model to act immediately without examples.


## 3. Few-shot (Exemplar) Prompt
Purpose: Provide examples to demonstrate desired format/style.

Template:

Example 1:
Input: ...
Output: ...

Example 2:
Input: ...
Output: ...

Now follow the same format for:
Input: [USER_INPUT]

Use for: tasks requiring structured or domain-specific outputs (parsing, rewriting, translations, etc.).


## 4. Chain-of-Thought (CoT) / Step-by-step
Purpose: Elicit model reasoning for complex problems.

Template:

"Let's think step by step. First identify subproblems, then solve each, and finally combine results. Show your reasoning and then give a short final answer." 

Caveat: CoT can produce longer outputs and may leak reasoning; use when you need interpretability or multi-step derivation.


## 5. ReAct / Tooling Prompt
Purpose: Combine reasoning with tool calls (retrieval, code execution, calculators).

Template:

You can use the following tools: [TOOL_LIST]. For each step, decide whether to (1) Think, (2) Act (call a tool with input), or (3) Answer. When calling a tool, output a JSON block specifying the tool and input. After the tool result, continue reasoning.

Example (pseudo):
{"action": "search", "input": "error message"}


## 6. Retrieval-Augmented Generation (RAG) Prompt
Purpose: Instruct the model to only use retrieved documents and cite sources.

Template:

You are given the following documents delimited by <DOC i> ... </DOC i>. Use only the information inside these documents to answer. If the answer cannot be found, reply "I don't know". Provide a short answer and list the doc ids you used.


## 7. Structured Output (JSON Schema)
Purpose: Force model to respond in a strict machine-readable format.

Template:

Respond with JSON matching this schema:
{
  "title": string,
  "steps": [{"desc": string, "duration_minutes": integer}],
}

Do not include any surrounding text or markdown; only output valid JSON.


## 8. Iterative Refinement / Critique Loop
Purpose: Improve outputs through revision passes.

Template:

Step 1: Produce initial draft.
Step 2: Critique the draft for correctness, style, and edge-cases; list fixes.
Step 3: Produce final revised draft incorporating the fixes.


## 9. Safety Guardrails
Purpose: Ensure outputs follow safety and policy constraints.

Template:

Do not produce content that: [list of forbidden content]. If a request is unsafe, refuse with the message: "I can't assist with that." Provide alternatives when possible.


## 10. Debugging / Code Fix Prompt
Purpose: Provide minimal reproducible fixes and explanations.

Template:

You are given failing test output and a code snippet. Identify the root cause, propose a minimal fix, and include a one-line explanation of why it fixes the problem. Provide a single code block with the patch.


---

## Example Master Prompts (Ready to use)

1) Summarization (short):
System: You are a concise summarizer. Output exactly 3 bullet points and one TL;DR sentence.
User: Summarize: [TEXT]

2) Code generation with tests:
System: You are an expert software engineer. Provide runnable Python 3.11 code and Pytest tests for the implemented behavior. Keep code self-contained.
User: Implement [SPEC].

3) RAG question answering:
System: You are an expert assistant that must use only provided documents. If answer is not in documents, reply "I don't know".
User: Documents: <DOC 1>...</DOC 1> Question: [Q]

4) Debugging assistant:
System: Be a debugging assistant. First list possible root causes, then give a minimal patch, then explain the fix in one sentence.
User: Failing test: [STACKTRACE]. Code: [CODE]


## Tips for using master prompts
- Keep system prompt stable and move variability to user prompt.
- Prefer few-shot for specialized formats.
- Use structured output when downstream parsing is required.
- Add explicit refusal wording for sensitive requests.
- When chaining tools, clearly separate tool calls and tool outputs with JSON blocks.


---

Path: `docs/master-prompts.md`
