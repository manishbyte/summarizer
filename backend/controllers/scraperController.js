const axios = require("axios");
const cheerio = require("cheerio");
const User = require("../models/userModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.scrapeWebsite = async (req, res) => {
  const {value} =req.body
   const url =`https://www.livemint.com/${value}`;
   const className ="thumbnail";
  if (!url || !className) {
    return res.status(400).json({ error: "URL and className are required!" });
  }

  try {
    // Fetch the HTML from the URL
    const { data } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    const results = [];

    // Find elements with the specified class
    $(`.${className}`).each((index, element) => {
      const anchor = $(element).find("a");
      const image = anchor.find("img");

      // Extract data from the anchor and image tags
      const item = {
        href: "https://www.livemint.com"+anchor.attr("href") || null,
        aTitle: anchor.attr("title") || null,
        imgSrc: image.attr("data-src") || image.attr("src") || null,
        imgTitle: image.attr("title") || null,
      };

      results.push(item);
    });
    
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Error scraping website:", error);
    res.status(500).json({ error: "An error occurred while scraping the website." });
  }
};




// exports.scrapeParagraphs = async (req, res) => {
//   let { url } = req.body;
//   const className = "storyPage_storyContent__m_MYl";

//   if (!url || !className) {
//     return res.status(400).json({ error: "URL and className are required!" });
//   }

//   try {
//     // Fetch the HTML content from the provided URL
//     const { data } = await axios.get(url);

//     // Load the HTML into Cheerio
//     const $ = cheerio.load(data);

//     // Select all `<p>` tags inside the `div` with the specified class
//     const paragraphs = $(`div .${className} p`)
//       .map((i, el) => $(el).text())
//       .get();

//     if (!paragraphs.length) {
//       return res.status(404).json({
//         success: false,
//         message: "Only subscription viewers can see it.",
//       });
//     }

//     console.log(paragraphs);

//     // Combine paragraphs into a single string
//     let textToSummarize = paragraphs.join(" ");

//     // Clean up the text
//     textToSummarize = textToSummarize.replace(/[.,!?'"(){}\[\];:]/g, "").replace(/\s+/g, " ").trim();
//     const customPrompt = `Please summarize the following content and provide it as bullet points in hindi:\n\n${textToSummarize}`;
//     console.log("Cleaned Text:", textToSummarize);

//     // Set up Hugging Face API request
//     const apiKey = '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';  // Replace with your Hugging Face API key

//     const response = await axios.post(
//       'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
//       { inputs: customPrompt },
//       {
//         headers: {
//           'Authorization': `Bearer ${apiKey}`,
//         },
//       }
//     );

//     // If the API returns a valid summary, send it as a response
//     if (response.data && response.data[0].summary_text) {
//       const summary = response.data[0].summary_text;
//       console.log("Summary:", summary);

//       return res.status(200).json({ success: true, data: summary });
//     } else {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to generate summary from Hugging Face API.",
//       });
//     }
//   } catch (error) {
//     console.error("Error scraping or summarizing:", error);
//     res.status(500).json({
//       error: "An error occurred while scraping or summarizing.",
//     });
//   }
// };

exports.scrapeParagraphs = async (req, res) => {
  let { url } = req.body;
  const className = "storyPage_storyContent__m_MYl";

  if (!url || !className) {
    return res.status(400).json({ error: "URL and className are required!" });
  }

  try {
    // Fetch the HTML content from the provided URL
    const { data } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Select all `<p>` tags inside the `div` with the specified class
    const paragraphs = $(`div .${className} p`)
      .map((i, el) => $(el).text())
      .get();

    if (!paragraphs.length) {
      return res.status(404).json({
        success: false,
        message: "Only subscription viewers can see it.",
      });
    }


    // Combine paragraphs into a single string
    let textToSummarize = paragraphs.join(" ");

    // Clean up the text
    textToSummarize = textToSummarize.replace(/[.,!?'"(){}\[\];:]/g, "").replace(/\s+/g, " ").trim();
    const customPrompt = `Please explain it 100 words in hindi and english mix in bullet points:\n\n${textToSummarize}`;

    // Use Google Gemini API
    const apiKey = process.env.API_KEY; // Replace with your Google Gemini API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(customPrompt);

    // If the API returns a valid summary, send it as a response
    if (result.response && result.response.text()) {
      const summary = result.response.text();

      return res.status(200).json({ success: true, data: summary });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to generate summary from Google Gemini API.",
      });
    }
  } catch (error) {
    console.error("Error scraping or summarizing:", error);
    res.status(500).json({
      error: "An error occurred while scraping or summarizing.",
    });
  }
};

exports.userSaveContent =async(req,res)=>{
    const { imgSrc, imgTitle, href } = req.body;
    const userId = req.user.id; // Assuming JWT authentication is in place
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Save the content to the user's savedItems array
      user.savedItems.push({ imgSrc, imgTitle, href });
      await user.save();
  
      res.status(200).json({ message: "Content saved successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error saving content" });
    }
}

exports.deleteUserContent =async(req,res)=>{
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { savedItems: { _id: id } },
    });
    res.status(200).json({ message: 'Item unsaved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsave item' });
  }
}
