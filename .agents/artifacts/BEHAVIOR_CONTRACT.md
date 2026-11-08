# Behavior contract — portable challenge roots

- **Product:** bip39lab
- **Target:** CLI `python3 scripts/challenge.py`
- **Setup:** no live API keys. Use a temp `HOME`, a dummy `HERMES_ENV`, and a closed-port `CHALLENGE_DEEPSEEK_URL`.

## User tasks

1. As an operator, I can pass an empty proposal file.
   - **Expect:** exit 1 and the words `empty proposal`. No vault note.
   - **Anti-cheat:** a blank file must not be treated as a successful round.

2. As an operator whose `HOME` has no Hermes tree, I can run a real proposal.
   - **Expect:** exit 1 and `ask_glm.py missing`. The command must not call a model.
   - **Anti-cheat:** success text or a written critique file counts as fail.

3. As an operator, I can point `ASK_GLM_SCRIPT` at a local stub, `HERMES_ENV` at a dummy key file, and `CHALLENGE_DEEPSEEK_URL` at a closed port.
   - **Expect:** exit 1 and `Deepseek failed`. No vault files under `--root`.
   - **Anti-cheat:** `DEEPSEEK_API_KEY not found` means the env file was ignored. A hang or a real API body means the URL override was ignored.

## Must not

- Print a key value.
- Write `01-Projects` or `.agents/artifacts/CHALLENGE.md` when a model call fails.
