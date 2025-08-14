# Visual Daily Planner MVP

This is a Minimum Viable Product (MVP) for a visual daily planner app designed for autistic youth and young adults. The app helps users build custom daily routines with visual aids, mark tasks as complete, and reset progress daily to promote independence and reduce anxiety. It prioritizes a clean, user-friendly interface to avoid sensory overload.

## Description

The app allows authenticated users to:
- Create and reorder daily routine steps with titles, emojis, and colors.
- View a visual checklist with progress tracking and completion toggles.
- Automatically reset tasks at midnight and save completion history in Firestore.

It uses React for the frontend, Firebase for authentication and data storage, Redux for state management, and Shadcn UI for components. The UI is mobile-friendly and responsive.

## Features

1. **User Authentication**
   - Firebase email/password login and signup.
   - Protected dashboard for authenticated users only.

2. **Create Daily Routine**
   - Add steps with title, emoji/icon, and optional color.
   - Reorder steps using up/down buttons.
   - Remove steps.

3. **Visual Daily Checklist**
   - Display today's routine as visual tiles with checkboxes.
   - Toggle completion and show progress bar/counter.

4. **Daily Reset & Progress Save**
   - Resets completion status at midnight.
   - Saves daily progress history in Firestore using the date as a key.

## Installation
1. Clone the repository:
   
   git clone https://github.com/Anacex/Autism-visual-routine-planner
   cd visual-planner
   

2. Install dependencies:
   
   npm install
   

3. Set up Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
   - Enable Email/Password authentication and Firestore.
   - Copy your Firebase config to `src/firebase.js`.

4. Run the development server:
   
   npm run dev
   

## Usage

- Open the app in your browser (e.g., `http://localhost:5173`).
- Sign up or log in with email/password.
- On the dashboard, add routine steps, reorder, toggle completion, and monitor progress.
- Logout from the dashboard to end the session.


2. **Vercel**:
   -get the app at: https://autism-visual-routine-planner-1-o0jhhfsel.vercel.app/login

## Technologies Used

- **Frontend**: React, Redux, Tailwind CSS, Shadcn UI.
- **Backend**: Firebase Authentication and Firestore.
- **Build Tool**: Vite.
- **Routing**: React Router.

## Contributing

Contributions are welcome! Please open an issue or pull request for suggestions or fixes.

## License

MIT License. See [LICENSE](LICENSE) for details.
```