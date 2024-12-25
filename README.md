News Aggregator and Summarizer Website

This is a MERN stack web application that aggregates news articles from various news websites using Cheerio and displays them on a user-friendly interface. The app includes a unique feature to summarize articles in Hindi using the Google Gemini API and allows users to save articles for later reference.

Features

News Aggregation:

Extracts news articles from multiple websites using the Cheerio library.

Displays the news in an organized manner on the website.


Hindi Summarization:

A "Summarize" button is provided for each news article.

Clicking the button generates a concise summary of the article in Hindi using the Google Gemini API.


Save Articles:

Users can save their favorite articles for future reference.

Saved articles include both the full content and the Hindi summary.


Responsive Design:

The website is designed to provide a seamless experience on both desktop and mobile devices.



Tech Stack

Frontend:

React.js

Tailwind CSS for styling


Backend:

Node.js

Express.js


Database:

MongoDB for storing saved articles and user data


Scraping Library:

Cheerio for extracting data from external news websites


Summarization API:

Google Gemini API for generating Hindi summaries



How It Works

1. News Scraping:

The backend uses Cheerio to scrape articles from selected news websites.



2. Summarization:

Users click the "Summarize" button, and the backend sends the article content to the Google Gemini API for generating a Hindi summary.



3. Save Functionality:

Users can save articles, which are stored in the database for later access.
