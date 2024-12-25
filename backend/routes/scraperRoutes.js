const express = require("express");
const { scrapeWebsite,scrapeParagraphs, userSaveContent, deleteUserContent } = require("../controllers/scraperController");
const{protect}=require("../middlewares/authMiddleware")

const router = express.Router();

// Define the scraping route
router.post("/scrape",protect, scrapeWebsite);
router.post("/scrape-paragraphs",protect, scrapeParagraphs);
router.post("/save-content",protect,userSaveContent)
router.delete("/unsave-item/:id",protect,deleteUserContent)


module.exports = router;
