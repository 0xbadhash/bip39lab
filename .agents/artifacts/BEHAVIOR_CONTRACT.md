# Behavior contract — UC7 amber three-share

- **Product:** bip39lab
- **Target:** `/v2/?uc=7`
- **Setup:** static lab, ack overlay, gate start

## User tasks

1. As a user, I can fill all three SLIP-39 boxes and Try.
   - **Expect:** amber/orange “not the exercise” (`msg-warn`), not green success.
   - **Anti-cheat:** do not treat three lists as drill pass.

2. As a user, I can clear one box and Try two.
   - **Expect:** green match when those two are practice shares.

3. As a user, I can clear down to one box.
   - **Expect:** red honest fail.

## Must not

- Sign / fund / persist mnemonic
