# Instant Build

![Instant Build](/public/Instant_Build.png)

## Instant Build Banner

Instant Build is a cutting-edge web application designed to simplify the process of creating React-based web applications. By leveraging the power of AI and modern web technologies, Instant Build allows users to generate fully functional web applications simply by providing a prompt. Whether you're a seasoned developer or a beginner, Instant Build streamlines the development process, enabling you to focus on creativity and innovation.

## Features

- **Instant Application Creation**: Users can input a prompt, and Instant Build will generate a fully functional React web application tailored to their needs.
- **Google Authentication**: Secure and seamless user authentication using Google OAuth.
- **Gemini API Integration**: AI-powered responses to enhance the application generation process, making it smarter and more intuitive.
- **Payment Integration**: PayPal support for handling transactions, making it easy to monetize your applications.
- **Real-time Database**: Powered by Convex, ensuring real-time data handling and synchronization.

## Installation & Setup

Follow the steps below to run the project locally after cloning or downloading it from GitHub.

### Prerequisites
Ensure you have the following installed:

- **Node.js** (Latest LTS version recommended)
- **npm** (Comes with Node.js)
- **Convex CLI** (Install via `npm install -g convex`)

### Steps to Run Locally

#### Clone the repository

```bash
git clone https://github.com/jubin2003/Instant_Build.git
cd instant-build
```

#### Install dependencies

```bash
npm install
```

#### Set up environment variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
CONVEX_DEPLOY_KEY=
```

Update these variables with your actual API keys and configuration.

#### Run the backend (Convex server)

```bash
npx convex run
```

#### Start the frontend (Next.js server)

```bash
npm run dev
```

#### Open the application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

For deployment, use the following command:

```bash
npx convex dev
```

Deployment is currently configured for:

```bash
CONVEX_DEPLOYMENT=dev:greedy-dachshund-488 # team: jubin2003, project: webease
```

## Technologies Used

- **Next.js** – React framework for server-side rendering and static site generation.
- **Convex** – Real-time database for seamless data handling.
- **Google OAuth** – User authentication.
- **Gemini API** – AI-powered content generation.
- **TailwindCSS** – Styling framework.
- **PayPal API** – Payment processing.

## Contributing

We welcome contributions from the community! Feel free to fork the repository and submit pull requests. Please ensure you follow best coding practices and document any changes.

### Contribution Steps

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
