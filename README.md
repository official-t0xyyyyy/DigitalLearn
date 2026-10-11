# Digital Saathi — Digital Services Training Portal

A responsive, frontend-only college CEP project for **Training on DigiLocker, Aadhaar and PAN Services**.

## Features

- Responsive landing page and mobile navigation
- Three step-by-step training modules
- Official resource links
- Interactive five-question quiz with instant feedback and score
- FAQ accordion
- Module completion progress saved in browser local storage
- No forms that request Aadhaar numbers, PAN numbers, OTPs or passwords
- Accessible landmarks, keyboard focus indicators and reduced reliance on images

## Files

- `index.html` — page structure and content
- `styles.css` — visual design, responsive layouts and styling
- `script.js` — module tabs, local progress, navigation and quiz

## Run locally

**Option 1: Open directly**
1. Extract the ZIP file.
2. Open the `digital_services_training_portal` folder.
3. Double-click `index.html` to open it in your browser.

**Option 2: VS Code with Live Server**
1. Extract the ZIP file and open the folder in Visual Studio Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` and choose **Open with Live Server**.

No Node.js, package installation, backend, database or API keys are required.

## Customise it

- Edit page text and section content in `index.html`.
- Change colors and layout in `styles.css`; primary colors are defined at the top in `:root`.
- Edit training content in `moduleContent` in `script.js`.
- Edit quiz questions in `quizQuestions` in `script.js`.

## Official resources used

- DigiLocker: https://www.digilocker.gov.in/
- UIDAI: https://uidai.gov.in/
- Income Tax e-Filing: https://www.incometax.gov.in/iec/foportal/
- Protean PAN services: https://www.protean-tinpan.com/

## Important note

This is an independent educational project and is **not an official government website**. Service steps, eligibility and fees may change; verify current information on official portals. The project does not collect or transmit identity numbers or authentication secrets. Module progress is saved only in the current browser using local storage.
